var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var session = require('express-session');

var partials = require('express-partials');

var routes = require('./routes/index');
// We comment this due to requirement on the training
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
// Cambio en parte 1 modulo 8 : app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.urlencoded()); - Siguiendo lo que indica el log y el foro
app.use(bodyParser.urlencoded({ extended: true }));

// Tal como avisa el log, esta invocación está deprecada y por tanto hay que invocar como indica el foro
//app.use(cookieParser('Quiz 2015'));
//app.use(session());

app.use(session({
secret: 'Quiz 2015',
resave: false,
saveUninitialized: true
}));

// Cambio en parte 3 modulo 8
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinamicos:
app.use(function(req, res, next) {

// guardar path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;

  //res.locals.timeCount = new Date();
  //debug("Registered Date"+res.locals.timeCount);

  next();
});

// Controlador de tiempo de sesion

app.use(function(req, res, next) {

//console.log ("I'm here, man with user session:" +req.session.user);

if (req.session.user === undefined || req.session.user === null) { 
  console.log("no active session");
  next();
}
else {

  var lastKnowRequest = new Date(req.session.timeCount);
  var currentTime = new Date();

  var deltaMinutes = ((currentTime - lastKnowRequest)/1000)/60;

  console.log ("En sesion. Ultima sesion conocida: "+ lastKnowRequest + 
                "Tiempo actual: "+ currentTime
                + "Minutos transcurridos"+deltaMinutes);

  if (deltaMinutes>2) { //Sesión expirada

    delete req.session.user;
    req.session.errors = [{"message": 'La sesión ha caducado tras 2 minutos de inactividad'}];
    res.redirect("/login");  

  } else { // Reset de contador

      req.session.timeCount = currentTime;

    next();
  }
  //console.log ("Tiempo actual: "+ currentTime);
  
}

});

app.use('/', routes);

// We comment this due to requirement on the training
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;

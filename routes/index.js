var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Super Quiz' });
});

/* GET Authors. */
router.get('/author', function(req, res) {
  res.render('author', { title: 'Acerca de' });
});

module.exports = router;

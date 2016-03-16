var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
  	title: 'Carpool',
  	username: req.cookies.username
  });
});

module.exports = router;

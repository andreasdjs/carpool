var express = require('express');
var router = express.Router();

/* 
	Rendering the data form.
*/

router.get('/', function(req, res, next) {
  console.log('Booking as: ' + req.cookies.username);
  res.render('adminNewBooking');
});

module.exports = router;

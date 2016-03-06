var express = require('express');
var carpool = require('../modules/carpool')
var router = express.Router();

/* 
	Rendering the data form.
*/

router.get('/', function(req, res, next) {

  console.log('Booking as: ' + req.cookies.username);

    // get todays date to send to date form
	var thisDay = carpool.newTime();

	res.render('newBooking', {
    	title: 'Boka fordon',
    	today: thisDay,
        username: req.cookies.username
	});

});

module.exports = router;

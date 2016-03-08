var express = require('express');
var router = express.Router();

var fs = require('fs');
var carpool = require('../modules/carpool');

router.get('/', function(req, res, next) {

/* 
	Getting the data object from readCoffee function and 
  	passing the object to the JADE template.
*/

	carpool.readBookings(pushContent);

    console.log('Booking list as: ' + req.cookies.username);

    function pushContent(obj){

    	// console.log('object from readBookings:\n\n' + JSON.stringify(obj));

    	res.render('bookings', {
          username: req.cookies.username,
        	title: 'Bookings',
        	bookings: obj
    	});

  	}
});

module.exports = router;

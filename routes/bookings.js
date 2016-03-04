var express = require('express');
var router = express.Router();

var fs = require('fs');
var carpool = require('../modules/carpool');

/* ??????
var booking = {
          "bookingId": "1000",
          "userId": "123",
          "vehicleId": "1",
          "startDate" : "2016-01-01",
          "endDate": "2016-01-05"
      };

carpool.writeNewBooking(booking);

*/

router.get('/', function(req, res, next) {

/* 
	Getting the data object from readCoffee function and 
  	passing the object to the JADE template.
*/

	carpool.readBookings(pushContent);

    console.log('Booking list as: ' + req.cookies.username);

    function pushContent(obj){

    	console.log('object from readBookings:\n\n' + JSON.stringify(obj));

    	res.render('bookings', {
          username: req.cookies.username,
        	title: 'Bookings',
        	bookings: obj
    	});

  	}
});

module.exports = router;

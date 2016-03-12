var express = require('express');
var router = express.Router();

var fs = require('fs');
var carpool = require('../modules/carpool');

router.get('/', function(req, res, next) {

/*
	Getting the data object from readBookings function and
  passing the object to the JADE template.
*/

	carpool.readBookings(pushContent);

    console.log('Booking list as: ' + req.cookies.username);

    function pushContent(obj){

      console.log('object from readBookings:\n\n' + JSON.stringify(obj));

      /* Filter based on logged in user.
         Show only the users bookings if normal user.
         Admin can see all. */

      if("admin" !== req.cookies.username){

        obj.bookings = obj.bookings.filter(function (el) {
          return el.userId == req.cookies.employeeNumber;
        });

        console.log('New object from readBookings:\n\n' + JSON.stringify(obj));

      }

      /* Reverse order */

      obj.bookings.reverse();

    	res.render('bookings', {
          username: req.cookies.username,
        	title: 'BOKNINGAR',
        	bookings: obj
    	});

  	}
});

module.exports = router;

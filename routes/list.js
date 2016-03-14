var express = require('express');
var router = express.Router();

var fs = require('fs');
var carpool = require('../modules/carpool');

router.get('/', function(req, res, next) {

/* 
	Getting the data object from readCoffee function and 
  	passing the object to the JADE template.
*/

	carpool.readVehicles(pushContent);

  function pushContent(obj){

  	// console.log('object from readVehicles:\n\n' + JSON.stringify(obj));

    var thisMonth = carpool.getTodaysMonth();

  	res.render('list', {
      	title: 'Vehicles',
        thisMonth: thisMonth,
        username: req.cookies.username,
      	vehicles: obj
  	});

	}

});

module.exports = router;

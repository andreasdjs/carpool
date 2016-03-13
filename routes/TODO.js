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

  	console.log('object from readVehicles:\n\n' + obj);

    var thisYear = carpool.getTodaysYear();
    console.log('thisYear: ' + thisYear);
/*
    obj.vehicles = obj.vehicles.filter(function (el) {
      return parseInt(el.latestAnnualCarInspection) !== thisYear;
    });
*/

    var thisMonth = carpool.getTodaysMonth();

  	res.render('TODO', {
        thisMonth: thisMonth,
        username: req.cookies.username,
      	vehicles: obj
  	});

	}

});

module.exports = router;

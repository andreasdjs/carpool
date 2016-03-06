var express = require('express');
var router = express.Router();

var fs = require('fs');
var carpool = require('../modules/carpool');

router.get('/', function(req, res, next) {

/* 
	Getting the data object from readCoffee function and 
  	passing the object to the JADE template.
*/

  var today = new Date();
  var thisMonth = today.getMonth()+1; //January is 0!
  console.log("Denna månad: " + thisMonth);

	carpool.readVehicles(pushContent);

  function pushContent(obj){

  	console.log('object from readVehicles:\n\n' + obj);

  	res.render('list', {
      	title: 'Vehicles',
        thisMonth: thisMonth,
        username: req.cookies.username,
      	vehicles: obj
  	});

	}

});

module.exports = router;

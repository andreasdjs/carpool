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

    var thisYear = carpool.getTodaysYear();
    var thisMonth = carpool.getTodaysMonth();

    /* Using zeroThisMonth for filtering in JADE */ 
    if(thisMonth<10) {
        var zeroThisMonth='0'+thisMonth;
    }

    console.log('thisYear: ' + thisYear);
    console.log('thisMonth: ' + thisMonth);

    console.log("carpool year: " + carpool.getTodaysYear());

    var today = new Date();
    var mm = today.getMonth();
    
    var myDateSub3 = new Date();
    myDateSub3.setMonth(today.getMonth()-2);
    console.log('myDateSub3: ' + myDateSub3.getMonth());

    var lastYear = new Date();
    lastYear.setFullYear(today.getFullYear()-1);
//    console.log('lastYear: ' + lastYear.getFullYear());

    /* Fix month 0 "bug" and add zeros */

    function buildComposite(buildMonth) {
      if(buildMonth<10) {
        buildMonth='0'+buildMonth;
      } 
      if(buildMonth == 0) {
        patch='12';
        return lastYear.getFullYear() + "-" + patch;
      }
      return thisYear + "-" + buildMonth;
    }

    //console.log('Composite sub3: ' + buildComposite(myDateSub3.getMonth()));

    console.log('-3: ' + buildComposite(today.getMonth()-2));
    console.log('-2: ' + buildComposite(today.getMonth()-1));
    console.log('-1: ' + buildComposite(today.getMonth()));
    console.log(' 0: ' + buildComposite(today.getMonth()+1));
    console.log('+1: ' + buildComposite(today.getMonth()+2));
    console.log('+2: ' + buildComposite(today.getMonth()+3));
    console.log('+3: ' + buildComposite(today.getMonth()+4));

    obj.vehicles = obj.vehicles.filter(function (el) {
      return el.latestAnnualCarInspection !== buildComposite(today.getMonth()+1) && 
             el.latestAnnualCarInspection !== buildComposite(today.getMonth()+2) && 
             el.latestAnnualCarInspection !== buildComposite(today.getMonth()+3) && 
             el.latestAnnualCarInspection !== buildComposite(today.getMonth()+4) && 
             el.latestAnnualCarInspection !== buildComposite(today.getMonth()) && 
             el.latestAnnualCarInspection !== buildComposite(today.getMonth()-1) && 
             el.latestAnnualCarInspection !== buildComposite(today.getMonth()-2); 
     });

  	res.render('TODO', {
        thisMonth: thisMonth,
        thisYear: carpool.getTodaysYear(),
        zeroThisMonth: zeroThisMonth,
        username: req.cookies.username,
      	vehicles: obj
  	});

	}

});

module.exports = router;

var express = require('express');
var router = express.Router();

var fs = require('fs');
var carpool = require('../modules/carpool');

router.get('/', function(req, res, next) {

/* 
	Getting the data object from readCoffee function and 
  	passing the object to the JADE template.
*/

	carpool.readUsers(pushContent);


    function pushContent(obj){

    	console.log('Object from readUsers:\n\n' + obj);

    	res.render('users', {
        	title: 'Users',
        	users: obj
    	});

  	}
});

module.exports = router;

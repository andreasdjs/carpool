var carpool = require('./modules/carpool')

var checkStartDate = new Date('06/08/2017');
var checkEndDate = new Date('06/18/2017');

carpool.checkDates(checkStartDate, checkEndDate);

/* Test with check bookings callback function */

carpool.checkBookings(pushBookings);

function pushBookings(obj){

	console.log('Object from readBookings:\n\n' + JSON.stringify(obj));

}


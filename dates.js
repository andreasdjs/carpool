var carpool = require('./modules/carpool')

/*
var checkStartDate = new Date('06/08/2017');
var checkEndDate = new Date('06/18/2017');

carpool.checkDates(checkStartDate, checkEndDate);

*/

/* Test with check bookings callback function */

/*
carpool.checkBookings(pushBookings);

function pushBookings(obj){

	console.log('Object from readBookings:\n\n' + JSON.stringify(obj));

}
*/

var start = "2016-01-01";
var end = "2016-03-05";

carpool.checkBookingsByDate(pushBookings, start, end);

function pushBookings(clashingVehicles){
	console.log('\nClashing vehicles: ' + clashingVehicles);
//	console.log('Clashing vehicles:\n\n' + JSON.stringify(obj));
}


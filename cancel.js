var carpool = require('./modules/carpool')

// carpool.cancelBooking(1);

var id = 1;

carpool.cancelBooking(pushBookings, id);

function pushBookings(obj){
	console.log('\nNew bokoing: ' + obj);
	console.log('\nNew bokoing: ' + JSON.stringify(obj));
}




var fs = require('fs');

function readVehicles(callback) {
  var fileReadStream = fs.createReadStream('carModel.json');
  var data = "";

  fileReadStream.on('data', (chunk) => {
    data += chunk;
  });

  fileReadStream.on('end', () => {
      var obj = JSON.parse(data);
      callback(obj); // Send object back
  });
}

function readUsers(callback) {
  var fileReadStream = fs.createReadStream('usersModel.json');
  var data = "";

  fileReadStream.on('data', (chunk) => {
    data += chunk;
  });

  fileReadStream.on('end', () => {
      var obj = JSON.parse(data);
      console.log(data);
      callback(obj); // Send object back
  });
}

function readBookings(callback) {
  var fileReadStream = fs.createReadStream('bookings.txt');
  var data = "";

  fileReadStream.on('data', (chunk) => {
    data += chunk;
  });

  fileReadStream.on('end', () => {
      var obj = JSON.parse(data);
      callback(obj); // Send object back
  });
}

// Generating a clean JSON data file at startup.

function initialWriteBookings() {
  var fileReadStream = fs.createReadStream('bookingModel.json');
  var data = "";

  fileReadStream.on('data', (chunk) => {
    data += chunk;
  });

  fileReadStream.on('end', () => {
   	fs.writeFile('bookings.txt', data, (err) => {
  	  if (err) throw err;
  	  console.log('New fresh JSON bookings data file written.');
  	}); 
  });
}

function writeNewBooking(newEntryObject) {
  var fileReadStream = fs.createReadStream('bookings.txt');
  var data = "";

  fileReadStream.on('data', (chunk) => {
    data += chunk;
  });

  fileReadStream.on('end', () => {
  	// Converting from string to object

  	var obj = JSON.parse(data);

  	// Pushing new object to last position in product array
  	obj.bookings.push(newEntryObject);

  	var write = JSON.stringify(obj);

  	// Writing to disk
  	fs.writeFile('bookings.txt', write, (err) => {
  	  if (err) throw err;
  	  console.log('Why...New bookings data file written including new object!');
  	}); 

  });
}

function checkDates (checkStartDate, checkEndDate) {

  var startDate = new Date('06/06/2016');
  var endDate = new Date('06/25/2016');
/*
  console.log("\n" + startDate);
  console.log(endDate);
  console.log("\n" + checkStartDate);
  console.log(checkEndDate); */

  if ((checkStartDate >= startDate && checkStartDate <= endDate) ||
         (startDate >= checkStartDate && startDate <= checkEndDate)) {
    // console.log('\nUpptaget!\n');
  } else {
    // console.log('\nLedigt!\n');
  }

}

function checkBookings(callback) {

  var checkStartDate = new Date('2016-01-01');
  var checkEndDate = new Date('2016-01-05');

  console.log("Check start: " + checkStartDate);
  console.log("Check End: " + checkEndDate);

  var fileReadStream = fs.createReadStream('bookings.txt');
  var data = "";

  fileReadStream.on('data', (chunk) => {
    data += chunk;
  });

  fileReadStream.on('end', () => {
    var obj = JSON.parse(data);
 
    /* Check each dates for any booking that date */
    
    obj.bookings.forEach(function(element) { 

      console.log("Start: " + element.startDate + " End: " + element.endDate); // 

      var sd = new Date(element.startDate);
      var ed = new Date(element.endDate);

      if ((checkStartDate >= sd && checkStartDate <= ed) ||
             (sd >= checkStartDate && sd <= checkEndDate)) {

        console.log('Upptaget!');

      } else {

        console.log('Ledigt!');

      }

    });
    
    callback(obj); // Send object back with bookings

  });

}

/* Testing with three parameters */

function checkBookingsByDate(callback, start, end) {

  console.log("\nCheck dates:\n")
  console.log("Start: " + start);
  console.log("End: " + end + "\n");

  var checkStartDate = new Date(start);
  var checkEndDate = new Date(end);

  var fileReadStream = fs.createReadStream('bookings.txt');
  var data = "";

  fileReadStream.on('data', (chunk) => {
    data += chunk;
  });

  fileReadStream.on('end', () => {
    var obj = JSON.parse(data);
 
    /* Check each dates for any booking that date */

    var clashingVehicles = [];
    
    obj.bookings.forEach(function(element) { 

      console.log("Start: " + element.startDate + " End: " + element.endDate); // 

      var sd = new Date(element.startDate);
      var ed = new Date(element.endDate);

      if ((checkStartDate >= sd && checkStartDate <= ed) ||
             (sd >= checkStartDate && sd <= checkEndDate)) {

        console.log('Upptaget!');
        console.log("Vehicle clashing: " + element.vehicleId);
        // do something
        clashingVehicles.push(element.vehicleId);

      } else {

        console.log('Ledigt!');

      }

    });
    
    callback(clashingVehicles);

  });

}

/* Get todays date in EU format */

function newTime() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();

  if(dd<10) {
      dd='0'+dd
  } 

  if(mm<10) {
      mm='0'+mm
  }

  today = yyyy+'-'+mm+'-'+dd;

  console.log("Time: " + today);

  return today;
}

module.exports.initialWriteBookings = initialWriteBookings;
module.exports.writeNewBooking = writeNewBooking;

module.exports.readBookings = readBookings;
module.exports.readVehicles = readVehicles;
module.exports.readUsers = readUsers;

module.exports.checkDates = checkDates;
module.exports.checkBookings = checkBookings;
module.exports.checkBookingsByDate = checkBookingsByDate;

module.exports.newTime = newTime;



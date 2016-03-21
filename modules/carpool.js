var fs = require('fs');

function readVehicles(callback) {
  var fileReadStream = fs.createReadStream('vehicles.txt');
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
  var fileReadStream = fs.createReadStream('users.txt');
  var data = "";

  fileReadStream.on('data', (chunk) => {
    data += chunk;
  });

  fileReadStream.on('end', () => {
      var obj = JSON.parse(data);
      // console.log(data);
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


function initialWriteUsers() {
  var fileReadStream = fs.createReadStream('usersModel.json');
  var data = "";

  fileReadStream.on('data', (chunk) => {
    data += chunk;
  });

  fileReadStream.on('end', () => {
    fs.writeFile('users.txt', data, (err) => {
      if (err) throw err;
      console.log('New fresh JSON Users data file written.');
    }); 
  });
}


function initialWriteVehicles() {
  var fileReadStream = fs.createReadStream('carModel.json');
  var data = "";

  fileReadStream.on('data', (chunk) => {
    data += chunk;
  });

  fileReadStream.on('end', () => {
    fs.writeFile('vehicles.txt', data, (err) => {
      if (err) throw err;
      console.log('Deprecated. Use initialWriteVehiclesPiped.');
      console.log('New fresh JSON vehicles data file written.');
    }); 
  });
}

/* 
  Inspired by http://www.sitepoint.com/basics-node-js-streams/
*/

function initialWriteVehiclesPiped() {

  var readableStream = fs.createReadStream('carModel.json');
  var writableStream = fs.createWriteStream('vehicles.txt');

  readableStream.pipe(writableStream);
  console.log('New fresh JSON vehicles data file written. Piped.');

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
  	  console.log('New bookings data file written including new object!');
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

        // If not canceled, push vehicle id to array

        if (element.canceled !== 1) {
          clashingVehicles.push(element.vehicleId);
        }

  
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

function getBookingsMaxId(callback) {
  var fileReadStream = fs.createReadStream('bookings.txt');
  var data = "";
  var maxId = 0;

  fileReadStream.on('data', (chunk) => {
    data += chunk;
  });

  fileReadStream.on('end', () => {
      var obj = JSON.parse(data);

      obj.bookings.forEach(function(element){
      if (parseInt(element.bookingId) >= maxId) {
        maxId = parseInt(element.bookingId) + 1;
      }

      });
      callback(maxId);
  });
}

function getTodaysMonth() {
    var today = new Date();
    var thisMonth = today.getMonth()+1; //January is 0!
    return thisMonth;
}

function getTodaysYear() {
    var today = new Date();
    var thisYear = today.getFullYear();
    return thisYear;
}

/* Inactivate booking by id and write */ 

function cancelBooking(callback, id) {
  var fileReadStream = fs.createReadStream('bookings.txt');
  var data = "";

  fileReadStream.on('data', (chunk) => {
    data += chunk;
  });

  fileReadStream.on('end', () => {
      var obj = JSON.parse(data);

      /* Loop through booking object to find booking */
      /* Set it to canceled. */

      for (var i=0; i<obj.bookings.length; i++) {
        if (obj.bookings[i].bookingId == id) {
          obj.bookings[i].canceled = 1;
          break;
        }
      }

      var writeData = JSON.stringify(obj)
      console.log("writeData: " + writeData);

      fs.writeFile('bookings.txt', writeData, (err) => {
        if (err) throw err;
        console.log('Canceled booking and wrote file.');
      }); 

      callback(obj);

  });
}

/* Update vehicle by Id */ 

function updateVehicleById(callback, id, updatedObject) {
  var fileReadStream = fs.createReadStream('vehicles.txt');
  var data = "";

  fileReadStream.on('data', (chunk) => {
    data += chunk;
  });

  fileReadStream.on('end', () => {
      var obj = JSON.parse(data);

      /* Loop through booking object to find booking */
      /* Set it to canceled. */

      console.log("updatedObject inside: " + JSON.stringify(updatedObject));

      for (var i=0; i<obj.vehicles.length; i++) {
        if (obj.vehicles[i].id == id) {
          obj.vehicles[i] = updatedObject;
          break;
        }
      }

      var writeData = JSON.stringify(obj)
      // console.log("writeData: " + writeData);

      fs.writeFile('vehicles.txt', writeData, (err) => {
        if (err) throw err;
        console.log('Wrote file with updated vehicle object.');
      }); 

      callback(obj);

  });
}

/* Update vehicle inspection date by Id */ 

function updateVehicleInspectionById(callback, id, inspected) {
  var fileReadStream = fs.createReadStream('vehicles.txt');
  var data = "";

  fileReadStream.on('data', (chunk) => {
    data += chunk;
  });

  fileReadStream.on('end', () => {
      var obj = JSON.parse(data);

      /* Loop through booking object to find booking */
      /* Set it to canceled. */

//      console.log("updatedObject inside: " + JSON.stringify(updatedObject));

        console.log("inspected inside function:" + inspected);

      for (var i=0; i<obj.vehicles.length; i++) {
        if (obj.vehicles[i].id == id) {
          obj.vehicles[i].latestAnnualCarInspection = inspected;
          break;
        }
      }

      var writeData = JSON.stringify(obj)
      // console.log("writeData: " + writeData);

      fs.writeFile('vehicles.txt', writeData, (err) => {
        if (err) throw err;
        console.log('Wrote file with updated vehicle object.');
      }); 

      callback(obj);

  });
}



module.exports.updateVehicleInspectionById = updateVehicleInspectionById;

module.exports.updateVehicleById = updateVehicleById;

module.exports.cancelBooking = cancelBooking;

module.exports.getTodaysMonth = getTodaysMonth;
module.exports.getTodaysYear = getTodaysYear;

module.exports.getBookingsMaxId = getBookingsMaxId;

module.exports.initialWriteBookings = initialWriteBookings;
module.exports.initialWriteUsers = initialWriteUsers;
module.exports.initialWriteVehicles = initialWriteVehicles;
module.exports.initialWriteVehiclesPiped = initialWriteVehiclesPiped;

module.exports.writeNewBooking = writeNewBooking;

module.exports.readBookings = readBookings;
module.exports.readVehicles = readVehicles;
module.exports.readUsers = readUsers;

module.exports.checkDates = checkDates;
module.exports.checkBookings = checkBookings;
module.exports.checkBookingsByDate = checkBookingsByDate;

module.exports.newTime = newTime;



var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var carpool = require('./modules/carpool')

var routes = require('./routes/index');
var users = require('./routes/users');
var list = require('./routes/list');
var bookings = require('./routes/bookings');
var newBooking = require('./routes/newBooking');
// var availableVehicles = require('./routes/availableVehicles');
var login = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/list', list);
app.use('/bookings', bookings);
app.use('/newBooking', newBooking);
// app.use('/availableVehicles', availableVehicles);
app.use('/login', login);


/* Initial Write of JSON-data */

carpool.initialWriteBookings();


/* Recieve login POST */

app.post('/loginSent', function(req, res) {

  res.cookie('username', req.body.username);
  console.log('cookie set:' + req.cookies.username);
  console.log(req.body.username + " tried to login.")

  if (req.body.username === "admin") {
    res.render('index', {
      written: 'User logged in.',
      username: req.body.username
    });
  } else {
    res.render('newBooking', {
      written: 'User logged in.',
      username: req.body.username
    });
  }

});

/* Recieve POST data & write new booking */

app.post('/sent', function(req, res) {
    var name = req.body.name;
    var vehicleId = req.body.vehicleId;
    console.log("Vehicle ID: " + req.body.vehicleId);

    var writeNewObject = {
      "bookingId": "7000",
      "userId": "123",
      "vehicleId": req.body.vehicleId,
      "startDate" : req.body.startDate,
      "endDate": req.body.endDate
    };

    carpool.writeNewBooking(writeNewObject);

/*
  function setNewMaxId() {
    coffee.getMaxId(function(i){
      var iString = toString(i);
      var writeNewObject = {
          "id": i,
            "title": req.body.title,
            "roastery" : req.body.roastery,
            "country": req.body.country,
            "producer": req.body.producer,
            "brewingMethod": req.body.brewingMethod,
            "about": req.body.about
      };
      carpool.writeNewBooking(writeNewObject);
    });
  }
  setNewMaxId(); */

/*
  res.render('newBooking', {
    written: 'Fordonet är bokat.'
  });
*/

  // Response with order confirmation

  res.render('orderConfirmation', {
    vehicleId: req.body.vehicleId,
    startDate : req.body.startDate,
    endDate: req.body.endDate,
    username: req.cookies.username,
    written: 'Fordonet är bokat.'
  });

});



/* Recieve POST data & write new booking */

app.post('/editVehicle', function(req, res) {
//    var name = req.body.name;
    var vehicleId = req.body.vehicleId;
    console.log("Vehicle ID from editVehicle: " + req.body.vehicleId);

/*    var writeNewObject = {
      "bookingId": "7000",
      "userId": "123",
      "vehicleId": req.body.vehicleId,
      "startDate" : req.body.startDate,
      "endDate": req.body.endDate
    };*/

//    carpool.writeNewBooking(writeNewObject);

/*
  function setNewMaxId() {
    coffee.getMaxId(function(i){
      var iString = toString(i);
      var writeNewObject = {
          "id": i,
            "title": req.body.title,
            "roastery" : req.body.roastery,
            "country": req.body.country,
            "producer": req.body.producer,
            "brewingMethod": req.body.brewingMethod,
            "about": req.body.about
      };
      carpool.writeNewBooking(writeNewObject);
    });
  }
  setNewMaxId(); */

/*
  res.render('newBooking', {
    written: 'Fordonet är bokat.'
  });
*/


  carpool.readVehicles(pushContent);

  function pushContent(obj){

  

    //console.log('object from readVehicles:\n\n' + JSON.stringify(obj));
    // Response with a list of available vehicles 

/*
    res.render('availableVehicles', {
        title: 'Tillgängliga fordon (2/3)',
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        vehicles: obj
    });
*/


    // Response with order confirmation

    res.render('editVehicle', {
      vehicleId: req.body.vehicleId,
      startDate : req.body.startDate,
      endDate: req.body.endDate,
      username: req.cookies.username,
      vehicles: obj
    });


  }


});


/* Recieve POST data from select date form*/

app.post('/getVehicles', function(req, res) {

  /* Replace with code that singles out non booked vehicles */

  console.log("Start date: " + req.body.startDate);
  console.log("End date: " + req.body.endDate);



  carpool.readVehicles(pushContent);

  function pushContent(obj){     
/*
    var start = "2016-01-01";
    var end = "2016-03-05";
*/
    var start = req.body.startDate;
    var end = req.body.endDate;


    carpool.checkBookingsByDate(pushBookings, start, end);

    function pushBookings(clashingVehicles){
      console.log('\nClashing vehicles: ' + clashingVehicles);

/*
        var filtered_obj = obj.filter(function(value){
          return value.id !== "1";
        });
*/
       if (clashingVehicles.length !== 0) {
           
           console.log("Handle clashes.");
/*
for (i = 0; i < cars.length; i++) { 
    text += cars[i] + "<br>";
}
*/
          for (i = 0; i < clashingVehicles.length; i++) {

          obj.vehicles = obj.vehicles.filter(function (el) {
            return el.id != clashingVehicles[i];
          });

          }

/*          var newArray = obj.vehicles.filter(function (el) {
            return el.id != clashingVehicles[0];
          });
*/

/*
          var newArray = obj.vehicles.filter(function (el) {
            return el.id >= 12;
          });
*/

          console.log(JSON.stringify(obj));

       }

      

      res.render('availableVehicles', {
          title: 'Tillgängliga fordon (2/3)',
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          vehicles: obj
      });


    }

/*

          res.render('availableVehicles', {
              title: 'Tillgängliga fordon (2/3)',
              startDate: req.body.startDate,
              endDate: req.body.endDate,
              vehicles: obj
          });

*/

  }

});

/*

var start = "2016-01-01";
var end = "2016-03-05";

carpool.checkBookingsByDate(pushBookings, start, end);

function pushBookings(clashingVehicles){
  console.log('\nClashing vehicles: ' + clashingVehicles);
}

*/


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

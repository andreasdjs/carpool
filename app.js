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
var newVehicle = require('./routes/newVehicle');
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
app.use('/newVehicle', newVehicle);
app.use('/login', login);


/* Initial Write of JSON-data */

carpool.initialWriteBookings();
carpool.initialWriteVehicles();
carpool.initialWriteUsers();


/* Recieve login POST */

app.post('/loginSent', function(req, res) {

  res.cookie('username', req.body.username);

  /*
  Insert cookie for employee number
  */

    carpool.readUsers(pushContent);

    function pushContent(obj){

      obj.users = obj.users.filter(function (el) {
        return el.username == req.body.username;
      });

      // console.log("Current user: " + JSON.stringify(currentUser));

      console.log("Setting cookie, employeeNumber: " + obj.users[0].employeeNumber);

      res.cookie('employeeNumber', obj.users[0].employeeNumber);

      // console.log('cookie set:' + req.cookies.username);
      // console.log(req.body.username + " tried to login.")

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

    }

});

/* Recieve POST data & write new booking */

app.post('/sent', function(req, res) {
    var name = req.body.name;
    var vehicleId = req.body.vehicleId;
    console.log("Vehicle ID: " + req.body.vehicleId);

    // get new booking id to set in new booking object

    carpool.getBookingsMaxId(pushContent);

    function pushContent(maxId){

      var writeNewObject = {
        "bookingId": maxId,
        "userId": req.cookies.employeeNumber,
        "vehicleId": req.body.vehicleId,
        "startDate" : req.body.startDate,
        "endDate": req.body.endDate
      };

      carpool.writeNewBooking(writeNewObject);

    }

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

  var vehicleId = req.body.vehicleId;
  console.log("Vehicle ID from editVehicle: " + req.body.vehicleId);

  carpool.readVehicles(pushContent);

  function pushContent(obj){

    // Response with edit Vehicle

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

    var start = req.body.startDate;
    var end = req.body.endDate;


    carpool.checkBookingsByDate(pushBookings, start, end);

    function pushBookings(clashingVehicles){
      console.log('\nClashing vehicles: ' + clashingVehicles);

       if (clashingVehicles.length !== 0) {
           
          console.log("Handle clashes.");

          for (i = 0; i < clashingVehicles.length; i++) {

            obj.vehicles = obj.vehicles.filter(function (el) {
              return el.id != clashingVehicles[i];
            });

          }

          // console.log(JSON.stringify(obj));

       }

      res.render('availableVehicles', {
          title: 'Tillgängliga fordon (2/3)',
          username: req.cookies.username,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          vehicles: obj
      });

    }

  }

});

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

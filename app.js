var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var carpool = require('./modules/carpool')
var fs = require('fs');

var routes = require('./routes/index');
var users = require('./routes/users');
var list = require('./routes/list');
var TODO = require('./routes/TODO');
var bookings = require('./routes/bookings');
var newBooking = require('./routes/newBooking');
var newVehicle = require('./routes/newVehicle');
var newUser = require('./routes/newUser');
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


/* Initial check for user coookies */

app.use('*', function(req, res, next) {

  if (
    (req.originalUrl !== '/login') 
    && (req.originalUrl !== '/loginSent') 
    && !req.cookies.username
    ) {
    res.render('login');  // Using render, as redirect shows the URL in location bar.
//    res.redirect('login');
  }

  next();

});

app.use('/', routes);
app.use('/users', users);
app.use('/list', list);
app.use('/TODO', TODO);
app.use('/bookings', bookings);
app.use('/newBooking', newBooking);
app.use('/newVehicle', newVehicle);
app.use('/newUser', newUser);
app.use('/login', login);





/* Initial Write of JSON-data */

carpool.initialWriteBookings();
carpool.initialWriteVehicles();
carpool.initialWriteUsers();

/* Remove vehicle */

app.get('/removeVehicle', function(req, res) {

  carpool.readVehicles(pushContent);

  function pushContent(obj){

    // Filter remove vehicle object by id
    // Example: http://localhost:3000/removeVehicle?id=1

    obj.vehicles = obj.vehicles.filter(function (el) {
      return el.id !== req.param('id');
    });

    var newData = JSON.stringify(obj);

    fs.writeFile('vehicles.txt', newData, (err) => {
      if (err) throw err;
      console.log('Removed vehicle with id:' + req.param('id') + '. Data file written.');
    });

    var thisMonth = carpool.getTodaysMonth();

    res.render('list', {
        title: 'Vehicles',
        thisMonth: thisMonth,
        username: req.cookies.username,
        vehicles: obj
    });

  }

});

/* Handle post from addNewVehicle */

app.post('/addNewVehicle',function(req,res){
  var writeNewVehicle = req.body;

  carpool.readVehicles(pushContent);

  function pushContent(obj){

    obj.vehicles.push(writeNewVehicle);

    var newData = JSON.stringify(obj);

    fs.writeFile('vehicles.txt', newData, (err) => {
      if (err) throw err;
      console.log('Data file written with new vehicle.');
    });

    var thisMonth = carpool.getTodaysMonth();

    res.render('list', {
        title: 'Fordon',
        thisMonth: thisMonth,
        username: req.cookies.username,
        vehicles: obj
    });

  }

});

/* Handle post from addNewUser */

app.post('/addNewUser',function(req,res){
  var writeNewUser = req.body;

  carpool.readUsers(pushContent);

  function pushContent(obj){

    obj.users.push(writeNewUser);

    var newData = JSON.stringify(obj);

    fs.writeFile('users.txt', newData, (err) => {
      if (err) throw err;
      console.log('Data file written with new user.');
    });

    var thisMonth = carpool.getTodaysMonth();

    res.render('users', {
        title: 'ANVÄNDARE',
        username: req.cookies.username,
        users: obj
    });

  }

});


/* Recieve login POST */

app.post('/loginSent', function(req, res) {

  /* Setting cookie for 15 min */
  res.cookie('username', req.body.username, { maxAge: 15*60*1000 });
//  res.cookie('username', req.body.username);

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

      /* Setting cookies for 15 min */

      res.cookie('employeeNumber', obj.users[0].employeeNumber, { maxAge: 15*60*1000 });
      res.cookie('firstName', obj.users[0].firstName, { maxAge: 15*60*1000 });
      res.cookie('lastName', obj.users[0].lastName, { maxAge: 15*60*1000 });

      // res.cookie('employeeNumber', obj.users[0].employeeNumber);
      // res.cookie('firstName', obj.users[0].firstName);
      // res.cookie('lastName', obj.users[0].lastName);

      // console.log('cookie set:' + req.cookies.username);
      // console.log(req.body.username + " tried to login.")

      if (req.body.username === "admin") {
        res.render('index', {
          written: 'User logged in.',
          username: req.body.username
        });
      } else {

        var thisDay = carpool.newTime();

        res.render('newBooking', {
            title: 'Boka fordon',
            today: thisDay,
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
        "endDate": req.body.endDate,
        "firstName": req.cookies.firstName,
        "lastName" : req.cookies.lastName,
        "canceled" : 0,
        "expired" : 0
      };

      carpool.writeNewBooking(writeNewObject);

    }

  // Response with order confirmation

  res.render('orderConfirmation', {
    vehicleId: req.body.vehicleId,
    startDate : req.body.startDate,
    endDate: req.body.endDate,
    username: req.cookies.username,
    written: 'Fordonet är bokat.',
    firstName: req.cookies.firstName,
    lastName: req.cookies.lastName
  });

});


/* Recieve post from bookings-page, with booking cancelation */

app.post('/cancelBooking', function(req, res) {

  // console.log('Cancel booking with id:' + req.body.bookingId);

  var id = req.body.bookingId; // bookingId from form post 

  carpool.cancelBooking(pushBookings, id);

  // console.log('Booking list as: ' + req.cookies.username);

  function pushBookings(obj){

    // console.log('object from readBookings:\n\n' + JSON.stringify(obj));

    /* Filter based on logged in user.
       Show only the users bookings if normal user.
       Admin can see all. */

    if("admin" !== req.cookies.username){

      obj.bookings = obj.bookings.filter(function (el) {
        return el.userId == req.cookies.employeeNumber;
      });

      // console.log('New object from readBookings:\n\n' + JSON.stringify(obj));

    }

    /* Reverse listing, newest first. */

    obj.bookings.reverse();

    /* Show bookings page */ 

    res.render('bookings', {
        username: req.cookies.username,
        title: 'BOKNINGAR',
        bookings: obj
    });

  }

});


/* Recieve POST data & write new booking */

app.post('/editVehicle', function(req, res) {

  var vehicleId = req.body.vehicleId;
  console.log("Vehicle ID from editVehicle: " + req.body.vehicleId);

  carpool.readVehicles(pushContent);

  function pushContent(obj){

    // Response with edit Vehicle

    obj.vehicles = obj.vehicles.filter(function (el) {
      return el.id === req.body.vehicleId;
    });

    console.log("editVehicle obj: " + JSON.stringify(obj.vehicles[0]));

    var editVehicleObj = obj.vehicles[0];

    console.log(JSON.stringify(editVehicleObj));

    res.render('editVehicle', {
      vehicleId: req.body.vehicleId,
      startDate : req.body.startDate,
      endDate: req.body.endDate,
      username: req.cookies.username,
      vehicle: editVehicleObj
    });

  }

});

/* Recieve post from edit vehicle page and update datafile */

app.post('/updateVehicle', function(req, res) {

  var id = req.body.id; // bookingId from form post 

  var newObject =
  {
      "id": req.body.id,
      "regNumber": req.body.regNumber,
      "brand": req.body.brand,
      "name": req.body.name,
      "transmission": req.body.transmission,
      "type": req.body.type,
      "fuel": req.body.fuel,
      "mileage": req.body.mileage,
      "lastInspectionMonth" : req.body.lastInspectionMonth,
      "latestAnnualCarInspection" : req.body.latestAnnualCarInspection
    }

  carpool.updateVehicleById(pushVehicle, id, newObject)

  function pushVehicle(obj){

    /* Show vehicle list page with updated vehicle */ 

/*
    var thisMonth = carpool.getTodaysMonth();

    res.render('list', {
        title: 'Vehicles',
        thisMonth: thisMonth,
        username: req.cookies.username,
        vehicles: obj
    });

    */

    res.redirect('/list');

  }

});


/* Recieve post from edit vehicle page and update datafile */

app.get('/inspected', function(req, res) {


  var id = req.param('id');
  var inspected = req.param('inspected');
  console.log("Inspected: " + inspected);
  console.log("id: " + id);

  carpool.updateVehicleInspectionById(pushVehicle, id, inspected)

  function pushVehicle(obj){

    res.redirect('/TODO');

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

       }

       //console.log(JSON.stringify(obj));

      /* Sort by mileage, ascending order.  */

      obj.vehicles.sort(function(a, b){
        return a.mileage - b.mileage;
      });

       /* Small */

        var smallVehicles = { "vehicles": [] };

        smallVehicles.vehicles = obj.vehicles.filter(function (el) {
              return el.type === "S";
        });

       /* Medium */

        var mediumVehicles = { "vehicles": [] };

        mediumVehicles.vehicles = obj.vehicles.filter(function (el) {
              return el.type === "M";
        });

       /* Large */

        var largeVehicles = { "vehicles": [] };

        largeVehicles.vehicles = obj.vehicles.filter(function (el) {
              return el.type === "L";
        });

       /* Extra large */

        var xlVehicles = { "vehicles": [] };

        xlVehicles.vehicles = obj.vehicles.filter(function (el) {
              return el.type === "XL";
        });


        // console.log(JSON.stringify(smallVehicles));

        //console.log(JSON.stringify(obj));

      res.render('availableVehicles', {
          title: 'Tillgängliga fordon (2/3)',
          username: req.cookies.username,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          smallVehicle: smallVehicles.vehicles[0],
          mediumVehicle: mediumVehicles.vehicles[0],
          largeVehicle: largeVehicles.vehicles[0],
          xlVehicle: xlVehicles.vehicles[0]
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

var carpool = require('./modules/carpool')

var checkStartDate = new Date('06/08/2017');
var checkEndDate = new Date('06/18/2017');

carpool.checkDates(checkStartDate, checkEndDate);
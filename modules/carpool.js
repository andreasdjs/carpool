var fs = require('fs');

function readVehicles(callback) {
  var fileReadStream = fs.createReadStream('carModel.json');
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

module.exports.readVehicles = readVehicles;
module.exports.readUsers = readUsers;
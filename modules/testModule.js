exports.readModel = function(callback) {
  var fileReadStream = fs.createReadStream('testModel.txt');
  var data = "";

  fileReadStream.on('data', (chunk) => {
    data += chunk;
  });

  fileReadStream.on('end', () => {
	  	console.log(data);
      var obj = JSON.parse(data);
      callback(obj); // Send object back
  });
}

exports.myFunction = function(parameter) {
	var output = parameter;
	return output;
}
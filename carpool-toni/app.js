




var express = require('express');
var app = express();
var fs = require('fs');
var port = process.env.PORT || 8080;

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({	extended: true })); // support encoded bodies

// routes will go here

app.set("view engine","jade");
 app.set("views", __dirname + "/templates");
 


app.get('/',function(req,res){
	res.render('adminedit');
	
	});	// end app.get
	
app.post('/',function(req,res){
	var gugge = req.body;
	var AddCarStream = fs.createReadStream('carM.json');
	var data = '';
	
	AddCarStream.on('data',function(chunk){
			data += chunk;
			});	// end RemoveCarStream data
	AddCarStream.on('end',function(){
		var obj = JSON.parse(data);
		obj.push(gugge);
		console.log(2)
		res.send(obj);
		
		var addCar = JSON.stringify(obj);
		fs.writeFile('carM.json',addCar);
		
		}); // end RemoveCarStream end
	
	}); // end add post
	


	
	


// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);// JavaScript Document
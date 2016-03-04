// grab the packages we need
var express = require('express');
var app = express();
var fs = require('fs');
var port = process.env.PORT || 7080;

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({	extended: true })); // support encoded bodies

// routes will go here

app.set("view engine","jade");
 app.set("views", __dirname + "/templates");
 
/*************************************************************
TAR BORT BIL, FAST JAG HAR TÄNKT ATT BAKA IN DENNA KOD I APP.JS men ni fixar det lätt,
***************************************************************/ 

app.get('/',function(req,res){
	res.render('remove');
	});	// end app.get

app.post('/', function(req, res) {
	
	// skriv till fil, append inte skriv över
	
	var gugge = req.body.id;
	console.log("post request: " + req.body.id);
	var stream = fs.createReadStream('carModel.json');
	var data='';
	
	
	
	
			stream.on('data',function(chunk){
			data += chunk;
			});	// end stream data
		
			stream.on('end',function(){
				var obj = JSON.parse(data);
				//console.log(obj);
			
			
				var filtered_obj = obj.filter(function(value){
					return value.id !== gugge;
				});
				
			
				obj = JSON.stringify(filtered_obj);
				console.log(obj);
				
				res.send(obj);
				

				
				fs.writeFile('carModel.json',obj);
			});// end stream end
		
	});// end app.post


	


	
	


// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);


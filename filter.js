var ages = [32, 33, 16, 40];

function checkAdult(age) {
    return age >= 18;
}

function myFunction() {
	console.log(ages.filter(checkAdult));
}

myFunction();


var obj = {
    "vehicles": [
    	{
    		"id":"1",
    		"regNumber": "ABC123"
		},
		{
    		"id":"2",
    		"regNumber": "ABC124"
		},
		{
    		"id":"3",
    		"regNumber": "ABC125"
		}
    ]
}

console.log(obj);
console.log("id " + obj.vehicles[0].id);



var newArray = obj.vehicles.filter(function (el) {
  return el.id >= 2;
});

/*
    price <= 1000 & 
    sqft >= 500 & 
    num_of_beds >=2 & 
    num_of_baths >= 2.5 );
*/

console.log("New array: " + JSON.stringify(newArray));

/*
function checkId(id) {
    return id >= 2;
}

function myIdFunction() {
	console.log(obj.vehicles[0].filter(checkId));
}

myIdFunction();

*/


var apiKey = "dGgi3KrBpRVXBC6s76pF2fUucTde16bH";
var gmapsApiKey = "AIzaSyAcZBN476sRwEC3O98ED4Hr1IZTq2jptR8";

function getTSATimes(airport, callback){
	var reqUrl = "http://demo30-test.apigee.net/v1/hack/tsa?airport=" + airport + "&apikey=" + apiKey;
	httpGetAsync(reqUrl, callback);

}

function httpGetAsync(theUrl, callback){//from http://stackoverflow.com/a/4033310/2009336
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback("https://peterjrohrer.github.io/deltaT/");
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function timeRangeToMinMax(timeRange){//e.g. 1-10 min
	return timeRange.replace("min", "").split("-").map(function(e){return parseInt(e)})
}

function handleTSATimes(res){
	//console.log(res)
	res = JSON.parse(res)
	var lines = res.WaitTimeResult;
	var waitTimeMap = {}

	for(var i = 0; i < lines.length; i++){
		var line = lines[i]

		if(!waitTimeMap[line.checkpointID]){
			waitTimeMap[line.checkpointID] = line

			line.waitTimeRange = timeRangeToMinMax(line.waitTime)

		}
	}

	var checkpoints = res.AirportResult[0].airport.checkpoints

	for(var i = 0; i < checkpoints.length; i++){
		var checkpoint = checkpoints[i]

		waitTimeMap[checkpoint.id].checkpointData = checkpoint
	}

	return waitTimeMap
}



// getTSATimes("ATL", function(res){
// 	var waitTimeMap = handleTSATimes(res)

// 	console.log(waitTimeMap)
// 	document.getElementById("wait").innerHTML = waitTimeMap;

// })
document.getElementById("currentLocation").onclick = function() {
	var x = document.getElementById("currentLocation");
	function getLocation() {
    	if (navigator.geolocation) {
        	navigator.geolocation.getCurrentPosition(document.getElementById("address"));
        	console.log(navigator.geolocation);
    	} else {
        	x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
}
document.getElementById("submit").onclick = function() {




	fltnum = document.getElementById("fltnum").value;

	getFltInfo(fltnum, function(res){
		var arrivalAirport = JSON.parse(res).flightStatusResponse.statusResponse.flightStatusTO.flightStatusLegTOList.departureAirportCode;
		document.getElementById("airport").innerHTML = " at "+arrivalAirport+":";
		//var duration = getTime(arrivalAirport, "www.google.com");
		//console.log(duration);
		//document.getElementById(duration).innerHTML = duration;
		printFltTimes();
		getTSATimes(arrivalAirport, function(tsaTimes){
			var waitTimeMap = handleTSATimes(tsaTimes)
			console.log(waitTimeMap)

			var output = "<ul>"

			for(waitObjectKey in waitTimeMap){//just assume there's no CSS injection taking place here
				output += "<li>" + waitObjectToString(waitTimeMap[waitObjectKey]) + "</li>"
			}

			output += "</ul>"

			document.getElementById("waitTimes").innerHTML = output


			// getTime(document.getElementById('address').value || "711 techwood drive", arrivalAirport + " airport", "driving", function(e,r){
			// 	console.log(e,r)
			// })


		})
		duration = 36;
		waitTime = 20;
		totalTime = duration + waitTime + 60;
		document.getElementById("totalTime").innerHTML = totalTime;
		console.log(totalTime);

	})
	// document.getElementById("wait").innerHTML = getTSATimes("ATL");
	// console.log(fltnum);
	
}
function printFltTimes() {
	fltnum = document.getElementById("fltnum").value;
	getFltInfo(fltnum, function(res){
		var departureTime = JSON.parse(res).flightStatusResponse.statusResponse.flightStatusTO.flightStatusLegTOList.departureLocalTimeScheduled;
		var t = new Date(departureTime);
		if(t.getHours()>12) {
			var h = t.getHours()-12;
			var x = "PM";
		} else {
			h = t.getHours();
			x = "AM";
		}
		if(t.getMinutes()<10) {
			var m = "0"+t.getMinutes();
		} else {
			m = t.getMinutes();
		}
		document.getElementById("departureTime").innerHTML = h+":"+m+" "+x;
		console.log(departureTime);

	})
}

function waitObjectToString(waitObject){
	return waitObject.checkpointData.longname + " has a projected wait of " + waitObject.waitTime 
}

function getDate(res){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd<10) {
    	dd='0'+dd
	} 
	if(mm<10) {
    	mm='0'+mm
	} 
	return yyyy + "-" + mm + "-" + dd;
}
//print current time
var d = new Date();
if(d.getHours()>12) {
	var h = d.getHours()-12;
	var x = "PM";
} else {
	h = d.getHours();
	x = "AM";
}
if(d.getMinutes()<10) {
	var m = "0"+d.getMinutes();
} else {
	m = d.getMinutes();
}
document.getElementById("time").innerHTML = h+":"+m+" "+x;

function getFltInfo(fltnum, callback){
	var reqUrl = "https://demo30-test.apigee.net/v1/hack/status?flightNumber=" + fltnum +"&flightOriginDate=" + getDate() + "&apikey=" + apiKey;
	httpGetAsync(reqUrl, callback);

}

function getTime(airport, callback){
	//destination = airport+" airport";
	destination = "ATL Airport"
	mode = document.getElementById("method").value;
	httpGetAsync('https://maps.googleapis.com/maps/api/directions/json?origin=' + encodeURI(location) + '&destination=' + encodeURI(destination) + '&key=' + gmapsApiKey + '&mode=' + mode +  "?", callback);

}

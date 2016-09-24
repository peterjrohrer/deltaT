var apiKey = "dGgi3KrBpRVXBC6s76pF2fUucTde16bH";

function getTSATimes(airport, callback){
	var reqUrl = "http://demo30-test.apigee.net/v1/hack/tsa?airport=" + airport + "&apikey=" + apiKey;
	httpGetAsync(reqUrl, callback);

}

function httpGetAsync(theUrl, callback){//from http://stackoverflow.com/a/4033310/2009336
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function timeRangeToMinMax(timeRange){//e.g. 1-10 min
	return timeRange.replace("min", "").split("-").map(function(e){return parseInt(e)})
}

function handleTSATimes(res){
	console.log(res)
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

getTSATimes("ATL", function(res){
	var waitTimeMap = handleTSATimes(res)
	console.log(waitTimeMap)

})
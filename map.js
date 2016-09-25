var apiKey = "dGgi3KrBpRVXBC6s76pF2fUucTde16bH";
//var googleDirectionKey = config["GOOGLE_DIRECTIONS_KEY"]

location = "700 techwood drive atlanta"
destination = "ATL" + "airport"
mode = "driving"
function getTime(location, destination, mode, callback){

	https.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + encodeURI(location) + '&destination=' + encodeURI(destination) + /*'&key=' + googleDirectionKey + */ '&mode=' + mode , function(res){

		var body = ""
		res.on("data", function(data){
			body += data;
		})

		res.on("end", function(){
			callback(JSON.parse(body))
		})

	})
}
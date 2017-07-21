const KEY = '';
document.getElementById('locationForm').style.display="none";

function showForm() {
	document.getElementById('locationForm').style.display="block";
}

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(locationCoords, showError);
	} else {
		x.innerHTML = "Geolocation is not supported by this browswer.";
	}
}

function locationCoords(position) {
	var longitude = position.coords.longitude;
	var latitude = position.coords.latitude;
	var longStr = longitude.toString();
	var latStr = latitude.toString();
	var latlngStr = latStr + ", " + longStr;
	getURL(latitude, longitude);

	// var geocoder = new google.maps.Geocoder;
	// var infowindow = new google.maps.InfoWindow;
	// var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};

	// geocoder.geocode({'location': latlng}, function(results, status) {
	// 	if (status === 'OK') {
	// 		if (results[1]) {
	// 		infowindow.setContent(results[1].formatted_address);
	// 		var address = infowindow.formatted_address
	// 		console.log(address);
	// 		}
	// 	}
	// });
}

function showError(error) {
	switch(error.code) {
		case error.PERMISSION_DENIED:
			x.innerHTML = "User denied the request for Geolocation."
			break;
		case error.POSITION_UNAVAILABLE:
			x.innerHTML = "Location information is unavailable."
			break;
		case error.TIMEOUT:
			x.innerHTML = "The request to get user location timed out."
			break;
		case error.UNKNOWN_ERROR:
			x.innerHTML = "An unknown error occurred."
			break;
	}
}
getLocation();


function getURL(latitude,longitude) {
	var url = "https://crossorigin.me/https://api.darksky.net/forecast/";
	var key = '4d97d9d7a3f54669f5ae3c0ff32d4990';
	var exclude = '?exclude=hourly,daily,alerts,flags';
	console.log(url+KEY+"/"+latitude+","+longitude);

	var request = new XMLHttpRequest();
	request.onload = getJSON;
	request.onerror = errorFunctionName;
	request.open("GET", url+KEY+"/"+latitude+","+longitude+exclude, true);
	request.send();

	function getJSON() {
		console.log(this); //log the response
		var json = JSON.parse(this.responseText);
		var currentTemp = json.currently.temperature;
		var wind = json.currently.windSpeed;
		document.getElementById('temp').innerHTML = currentTemp + "&#8457";
		document.getElementById('wind').innerHTML = wind;
		console.log(json);
		console.log(json.currently.summary);
	}
	function errorFunctionName(e) {
		window.alert('Could not retrieve forecast from api.');
	}
};


function insertGoogleScript() {
	var google_api = document.createElement('script'),
		   api_key = '';

	// Inject the script for Google's API and reference the initGoogleAPI
	// function as a callback.
	google_api.src = 'https://maps.googleapis.com/maps/api/js?key='+ api_key +'&callback=initGoogleAPI&libraries=places,geometry';
	document.body.appendChild(google_api);
}


// SearchBox Method
function initGoogleAPI() {
	var autocomplete = new google.maps.places.SearchBox(document.querySelector("#city-search"));

	autocomplete.addListener('places_changed', function() {
		var place = autocomplete.getPlaces()[0];
		console.log(place.geometry.location.lat());
		console.log(place.geometry.location.lng());
		var newLat = place.geometry.location.lat();
		var newLong = place.geometry.location.lng();
		newLat = newLat.toString();
		newLong = newLong.toString();
		getURL(newLat, newLong);
	});
}

insertGoogleScript();
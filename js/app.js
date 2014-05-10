$(document).ready(function(){

	var geocoder = new google.maps.Geocoder();

	var debug = true;

	var api = {
		'submitReport':'',
		'getReports':''
	};

	var base_url = 'http://localhost/hack/zariyahack/';

	var customSettings = {};
	customSettings.language = "en";

	if(localStorage.getItem('language') != null){
		customSettings.language = localStorage.getItem('language');
	}

	log("Langauge: "+customSettings.language);

	

	//Local Database
	var zariya = {};
	zariya.indexedDB = {};

	init();

	function init(){
		getCurrentLocation();
	}

	function pushDetails(){
		var fd = [];
		var person = $("#person").val();
		if(person.length > 0){
			fb += "person"
		}
		var doYouKnow = $("#doyouknow").val(); //Y / N
		var firstTimeCrime = $("#firsttimecrime").val(); //Y / N
		var incidentList = $("#incidentList").val(); //Select Box
		var otherIncidence = $("#otherIncidence").val();
		var location = $("#location").val();
		var locationLat = $("#locationLat").val();
		var locationLng = $("#locationLng").val();
		var incidentDate = $("#incidentDate").val();
		var incidentTime = $("#incidentTime").val();
		var comments = $("#comments").val();
		var firstName = $("#firstName").val();
		var lastName = $("#lastName").val();
		var email = $("#email").val();
		var number = $("#number").val();
		sendData(fd);
	}

	//Post form submission
	function sendData(formData){
		var dataPush = $.ajax({
	            type: "POST",
	            dataType: "jsonp",
	            data:formData,
	            processData: false,
	            url: api.submitReport,
	            success: function (res) {
	            	if(res.id.length > 0){
	            		return res.id;
	            	}
	            	return 0;
	            }
		});
	}

	//GeoTargeting
	$(document).on("click","#getGeo",function(e){
		e.preventDefault();
		var ltlng = $("#latlng").val();
		var op = getReverseLatLng(ltlng);
	});

	function getCurrentLocation(){
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(function(position){
				//Success
				log("CURRENT POSITION==========");
				log(position);
				if(position.coords){
					var crd = position.coords;
					var latLng = crd.latitude+","+crd.longitude;
					log(latLng);
					$("#latlng").val(latLng);
				}
			},function(){
				//Error
				return false;
			});
		}
	}


	function getReverseLatLng(latlong){
		if(latlong.length >0){
			var splitLatLng = latlong.split(',',2);
			var lat = parseFloat(splitLatLng[0]);
			var lng = parseFloat(splitLatLng[1]);
			var latlong = new google.maps.LatLng(lat,lng);
			geocoder.geocode({'latLng': latlong}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					log("GEO REVERSE STA=============");
					log(results);
					if(results.length >0){
						$("#location").val(results[0]['formatted_address']);
					}
					log("GEO REVERSE END=============");
				}else{
					return false;
				}
			});
		}
		return false;
	}

	function log(message){
		if(debug){
			console.log(message);
		}
	}

	//Langauge selection
	$(document).on("click","#languages li",function(){
		var language = $(this).attr("data-language");
		localStorage.setItem('language',language);
		customSettings.language = language;
	});

});
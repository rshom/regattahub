// TODO
// clean up this file
// get your global variables all together


// Radius of earth in meters'
//var R = 6371e3;
var R = 6371000;// I don't trust math unnecessarily

var currentLat = 0; // I'll update these inside the postion function
var currentLon = 0;
// target must be a global variable, so I can see it
var target;
var output;
var myLat = 0;
var myLon = 0;

//// neat trick for grabbing the location string
function getQueryVariable(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

//// deg_to_rad
function deg_to_rad(degs) {
    return degs*Math.PI/180;
}

function rad_to_deg(rads) {
    // blah
    var degs = rads*180/Math.PI;
    return degs;
}

function find_endpoint(lat,lon,distance,bearing) {
    // Make sure this is correct
    var lat1 = deg_to_rad(lat);
    var lon1 = deg_to_rad(lon);
    var lat2;
    var lon2;
    var brng = deg_to_rad(bearing);
    var d = distance;
    var lat2 = Math.asin( Math.sin(lat1)*Math.cos(d/R) + 
			  Math.cos(lat1)*Math.sin(d/R)*Math.cos(brng) );
    var lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(lat1),
				 Math.cos(d/R)-Math.sin(lat1)*Math.sin(lat2));
    return {
	latitude: rad_to_deg(lat2),
	longitude: rad_to_deg(lon2)
    };
}

function find_distance(lat1,lon1,lat2,lon2) {
    // find between two points in meters
    // performance matters and small distances
    //// test these assumptions
    //// therefore pythagoran's theorem on an equilatoral projection is fine
    var lat1 = deg_to_rad(lat1)
    var lat2 = deg_to_rad(lat2)
    var lon1 = deg_to_rad(lon1)
    var lon2 = deg_to_rad(lon2)
    var x = (lon2-lon1)*Math.cos((lat1+lat2)/2);
    var y = lat2-lat1;
    var distance = Math.sqrt(x*x+y*y)*R; //meters
    return distance;
}
function find_bearing(lat1,lon1,lat2,lon2) {
    // find bearing from one point to another in degrees
    // take a closer look at this function. It works now, but something is wrong with it.
    lat1 = deg_to_rad(lat1)
    lat2 = deg_to_rad(lat2)
    lon1 = deg_to_rad(lon1)
    lon2 = deg_to_rad(lon2)
    var x = (lon2-lon1)*Math.cos((lat1+lat2)/2);
    var y = lat2-lat1;
    var bearing = Math.atan2(x,y); 
    return rad_to_deg(bearing); // degrees
}

function getTime() {
    var now = new Date();
    var time = '' + now.getUTCHours() + ':';
    if (now.getUTCMinutes() < 10) time += '0';
    time += now.getUTCMinutes() + ':';
    if (now.getUTCSeconds() < 10) time += '0';
    time += now.getUTCSeconds();
    //time += ':' + now.getUTCMilliseconds();
    return time;
}

function formatTime(date) {
    var time = '' + date.getUTCHours() + ':';
    if (date.getUTCMinutes() < 10) time += '0';
    time += date.getUTCMinutes() + ':';
    if (date.getUTCSeconds() < 10) time += '0';
    time += date.getUTCSeconds();
    //time += ':' + date.getUTCMilliseconds();
    return time;
}

function displayError(message) {
    var div = document.getElementById('errorDisplay');
    div.innerHTML = message + div.innerHTML;
}

function displayCurrentPosition(position) {
    // place the positional data into appropriate html blocks for demo
    // start with lat
    var placeholder = document.getElementById('latDisplay');
    placeholder.innerHTML = "LAT: " + position.coords.latitude;
    // now lon
    var placeholder = document.getElementById('lonDisplay');
    placeholder.innerHTML = "LON: " + position.coords.longitude;
    // now heading
    var placeholder = document.getElementById('headDisplay');
    placeholder.innerHTML = "HDG: " + position.coords.heading;
    // now heading
    var placeholder = document.getElementById('speedDisplay');
    placeholder.innerHTML = "SPD: " + position.coords.speed;
    // now time
    var placeholder = document.getElementById('timeDisplay');
    placeholder.innerHTML = "Updated: " + getTime()
}

function watchPosition(target) {
    //var id = getCurrentPositionRequest++;
    //console.log('watchPosition start - request ' + id);
    //navigator.geolocation.getCurrentPosition(
    navigator.geolocation.watchPosition(
	function(position) {
	    // Calculate distance and bearing to target
	    var targetDistance = find_distance(position.coords.latitude,position.coords.longitude,target.latitude,target.longitude);
	    var targetBearing = find_bearing(position.coords.latitude,position.coords.longitude,target.latitude,target.longitude);
	    var relativeBearing = targetBearing - position.coords.heading;
	    // Rotate my image of an arrow
	    var arrow_html = document.getElementById('arrow'); // grab it by ID
	    var arrow_x_html = document.getElementById('arrow_x');
	    var imgRotation = relativeBearing;
	    // if on a device with no bearing use target bearing
	    //var imgRotation = targetBearing;
	    if ( targetDistance>5 ) {
		arrow_html.className = "fa fa-arrow-circle-up";
		imgRotation = "rotate("+imgRotation+"deg)"; //make it a proper string
		arrow_html.style.transform = imgRotation; //change it
		arrow_html.style.color = "green";
	    } else {
		arrow_html.className = "fa fa-times-circle-o";
		arrow_html.style.color = "red";
	    }

	    // save these variables as global
	    myLat = position.coords.latitude;
	    myLon = position.coords.longitude;

	    // display on screen
	    var myHdg = position.coords.heading;
	    //var placeholder = document.getElementById('myHeading');
	    //placeholder.innerHTML = "Heading: " + myHdg;
	    var placeholder = document.getElementById('currentTargetDistance');
	    placeholder.innerHTML = targetDistance;
	    
	    // I don't actually need to target bearing except for calculations
	    //var placeholder = document.getElementById('currentTargetBearing');
	    //placeholder.innerHTML = "True Bearing to Target: " + targetBearing;

	    //var placeholder = document.getElementById('currentRelativeBearing');
	    //placeholder.innerHTML = "Relative Bearing to Target: " + relativeBearing;
	    
	    // update the time
	    //var placeholder = document.getElementById('timeDisplay');
	    //placeholder.innerHTML = "Updated: " + getTime()
	},

	function(error) {
	    console.log('watchPosition error - request');
	    console.log(error);
	},

	{
	    timeout: 50000,
	    maximumAge: Infinity,
	    enableHighAccuracy: true
	}

    );

}
function updateTarget() {
    // set target distance and bearing to equal the ones in the form
    var targetDistance = document.getElementsByName("targetDistance")[0].value;
    var targetBearing = document.getElementsByName("targetBearing")[0].value;

    // calculate target lat and lon
    // current lat and lon are stored as global variables
    target = find_endpoint(myLat,myLon,targetDistance,targetBearing);

    //display them
    // start with lat
    var placeholder = document.getElementById('targetLatDisplay');
    placeholder.innerHTML = "LAT: " + target.latitude;
    // now lon
    var placeholder = document.getElementById('targetLonDisplay');
    placeholder.innerHTML = "LON: " + target.longitude;
    // update the time
    var placeholder = document.getElementById('targetUpdateTime');
    placeholder.innerHTML = "Updated: " + getTime()

    

}


function build_course() {
    // pulls from location.search.substring(1) or similar input as argument
    ////?builder&courseType=Windward-Leeward&windwardLeg=1000&startLine=200
    //outputs a list of marks
    var output;

    // figure out course type
    var courseType = getQueryVariable('courseType');

    // depending on the courseType, we will build the course differently
    if (courseType=='Windward-Leeward') {
	var windwardLeg = Number(getQueryVariable('windwardLeg'));
	var startLine = Number(getQueryVariable('startLine'));

	// variable set up
	var marks = [];


	// race committee is always at 0,0 since it never moves and anchors the course
	var mark = {}; 
	mark.name = 'Boat'; // naming conventions are real life...
	mark.x = 0;
	mark.y = 0;
	marks.push(mark);

	// pin is left of boat
	var mark = {}; // mark needs to be redeclared every time
	mark.name = 'Pin';
	mark.x = -startLine;
	mark.y = 0;
	marks.push(mark);


	// weather mark is centered and up
	var mark = {};
	mark.name = 'Weather';
	mark.x = -startLine/2;
	mark.y = windwardLeg;
	marks.push(mark);

	
	// leeward mark is centered and down same distance as weather
	var mark = {};
	mark.name = 'Leeward';
	mark.x = -startLine/2;
	mark.y = -windwardLeg;
	marks.push(mark);

	output=marks;

    } else if (courseType=='Triangle') {
	var windwardLeg = Number(getQueryVariable('windwardLeg'));
	var startLine = Number(getQueryVariable('startLine'));

	// Build triangle course
	// variable set up
	var marks = [];

	// race committee is always at 0,0 since it never moves and anchors the course
	var mark = {};
	mark.name = 'Boat'; // naming conventions are real life...
	mark.x = 0;
	mark.y = 0;
	marks.push(mark);

	// pin is left of boat
	var mark = {};
	mark.name = 'Pin';
	mark.x = -startLine;
	mark.y = 0;
	marks.push(mark);

	// weather mark is centered and up
	var mark = {};
	mark.name = 'Windward';
	mark.x = -startLine/2;
	mark.y = windwardLeg;
	marks.push(mark);
	
	// reach mark is directly left of pin
	//// I'm making assumptions for simplicity
	var mark = {};
	mark.name = 'Reach';
	mark.x = -windwardLeg;
	mark.y = 0;
	marks.push(mark);

	// leeward mark is centered and down same distance as weather
	var mark = {};
	mark.name = 'Leeward';
	mark.x = -startLine/2;
	mark.y = -windwardLeg;
	marks.push(mark);

	output=marks;

    } else if (courseType=='Trapezoid') {
	var windwardLeg = Number(getQueryVariable('windwardLeg'));
	var startLine = Number(getQueryVariable('startLine'));
	var interiorAngle = deg_to_rad(60.);

	// Build trapezoid course
	//// this is a silly course, but impossible without our program
	// variable set up
	var marks = [];

	// race committee is always at 0,0 since it never moves and anchors the course
	var mark = {};
	mark.name = 'Boat'; // naming conventions are real life...
	mark.x = 0;
	mark.y = 0;
	marks.push(mark);

	// pin is left of boat
	var mark = {};
	mark.name = 'Pin';
	mark.x = -startLine;
	mark.y = 0;
	marks.push(mark);

	// weather mark is centered and up
	var mark = {};
	mark.name = 'Windward';
	mark.x = -startLine/2;
	mark.y = windwardLeg;
	marks.push(mark);
	
	// reach mark depends on the windward interior angle
	//// I'm making assumptions for simplicity
	var mark = {};
	mark.name = 'Reach';
	mark.x = (-2./3)*windwardLeg*Math.sin(interiorAngle)-startLine/2;
	mark.y = windwardLeg-(2./3)*windwardLeg*Math.cos(interiorAngle);
	marks.push(mark);

	// leeward mark is centered and down same distance as weather
	var mark = {};
	mark.name = 'Leeward';
	mark.x = (-2./3)*windwardLeg*Math.sin(interiorAngle)-startLine/2;
	mark.y = (-2./3)*windwardLeg*Math.cos(interiorAngle);
	marks.push(mark);

	// make a little reference for the finish
	var finishDistance = windwardLeg/16.; // silly
	var finishLine = startLine/2; // silly
	var finishAngle = deg_to_rad(120-90); //silly
	var x = mark.x+finishDistance*Math.cos(finishAngle);
	var y = mark.y-finishDistance*Math.sin(finishAngle);

	var mark = {};
	mark.name = 'Finish Starboard';
	mark.x = x+finishLine*Math.sin(finishAngle);
	mark.y = y+finishLine*Math.cos(finishAngle);
	marks.push(mark);

	var mark = {};
	mark.name = 'Finish Port';
	mark.x = x-finishLine*Math.sin(finishAngle);
	mark.y = y-finishLine*Math.cos(finishAngle);
	marks.push(mark);

	output=marks;

    } else if (courseType=='Custom') {
	// Build custom course
	// this one might require a seperate more involved function
	output = "Sorry I can't build custom courses yet. Try Windward-leedward perhaps";

    } else {
	output = "Error with courseType";
    }
	return output;
}

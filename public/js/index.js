'use strict';
function setup() {

	console.log('running clientSide.js');

	// Camera initialization
	noCanvas();
	const video = createCapture(VIDEO);
	video.size(320, 240);



	let lat = 0;
	let lon = 0;

	if ('geolocation' in navigator) {
		console.log(navigator);
		console.log('geolocation available');
		navigator.geolocation.getCurrentPosition(success, error, options);
	} else {
		console.log('geolocation NOT available');
	}

	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};

	async function success(pos) {
		let crd = pos.coords;

		console.log('Your current position is:');
		console.log(`Latitude : ${crd.latitude}`);
		console.log(`Longitude: ${crd.longitude}`);
		console.log(`More or less ${crd.accuracy} meters.`);
		lat = crd.latitude;
		lon = crd.longitude;

		document.getElementById('lat').textContent = lat.toFixed(2);
		document.getElementById('lon').textContent = lon.toFixed(2);
	}

	const button = document.getElementById('submit');
	button.addEventListener('click', postData);

	async function postData() {
		console.log('sending a POST!');

		video.loadPixels();
		// takes video canvas and
		// converts it to base64
		const image64 = video.canvas.toDataURL();
		const postdata = { lat, lon, image64 };
		console.log(postdata);
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: JSON.stringify(postdata) // body data type must match "Content-Type" header
		}

		const response = await fetch('/index/api', options);
		const data = await response.json();
		console.log(`here is the response: ${JSON.stringify(data)}`);
	}

	function error(err) {
		console.warn(`ERROR(${err.code}): ${err.message}`);
	}
}



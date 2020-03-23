'use strict';
console.log('running weather.js');

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

    let lat, lon, weather, air;
    try {
        let crd = pos.coords;

        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);
        lat = (crd.latitude).toFixed(2);
        lon = (crd.longitude).toFixed(2);

        document.getElementById('lat').textContent = lat;
        document.getElementById('lon').textContent = lon;

        // calling Server side route
        const api_url = `weather/${lat},${lon}`;
        const response = await fetch(api_url);
        const json = await response.json();
        weather = json.weather.currently;
        const temperature = weather.temperature.toFixed(1);
        document.getElementById('timezone').textContent = json.weather.timezone;
        document.getElementById('summary').textContent = weather.summary;
        document.getElementById('temp').textContent = temperature;

        air = json.air_quality.results[0].measurements[0];

        if (air) {
            const airDiv = document.getElementById('air');
            const airParagraph = document.createElement('p');
            airParagraph.textContent = `The concentration of particule matter (${air.parameter}) is ${air.value} ${air.units} ${air.units} last read on ${air.lastUpdated}`;
            airDiv.append(airParagraph);
        }

    } catch (error) {
        air = { value: -1 };
        console.log(error);
    }

    console.log('sending a POST!');
    const postdata = { lat, lon, weather, air };
    console.log(postdata);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(postdata) // body data type must match "Content-Type" header
    }

    const db_response = await fetch('/api', options);
    const db_data = await db_response.json();
    console.log(db_data);

}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message} `);
}



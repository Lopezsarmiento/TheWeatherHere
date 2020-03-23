const express = require('express');
const app = express();
const fs = require('fs');
const Datastore = require('nedb');
const fetch = require('node-fetch');
// loads content of .env file into a env variable.
require('dotenv').config();

//env variables
//console.log(process.env);

const port = process.env.PORT || 9000;
const file = './req_resFile.csv';
const logger = fs.createWriteStream(file, {
	flags: 'a' // 'a' means appending (old data will be preserved)
});
app.listen(port, () => console.log(`listening to port ${port}`));
// serves static files from public dir
app.use(express.static('public'));

app.use(express.json({ limit: '50mb' }));

// Create Database
const database = new Datastore('database.db');
const homedatabase = new Datastore('homedatabase.db');
database.loadDatabase();
homedatabase.loadDatabase();

// Routes
app.get('/api', (request, response) => {
	database.find({}, (err, data) => {
		if (err) {
			response.end();
			return;
		}
		response.json(data);
	});
});

app.get('/list/api', (request, response) => {
	homedatabase.find({}, (err, data) => {
		if (err) {
			response.end();
			return;
		}
		response.json(data);
	});
});

app.post('/api', (request, response) => {
	console.log('I have a request!!');
	const data = request.body;
	const timestamp = Date.now();
	data.timestamp = timestamp;
	database.insert(data);

	response.json(data);

	const fileInfo = {
		request: JSON.stringify(data),
		response: {
			status: 'success',
			latitude: data.lat,
			longitude: data.lon
		}
	}

	logger.write(JSON.stringify(fileInfo));
});

app.post('/index/api', (request, response) => {
	console.log('I have a request!!');
	const data = request.body;
	const timestamp = Date.now();
	data.timestamp = timestamp;
	homedatabase.insert(data);

	response.json(data);

	const fileInfo = {
		request: JSON.stringify(data),
		response: {
			status: 'success',
			latitude: data.lat,
			longitude: data.lon
		}
	}

	logger.write(JSON.stringify(fileInfo));
});

app.get('/weather/:latlon', async (request, response) => {
	const latlon = request.params.latlon.split(',');
	const lat = latlon[0];
	const lon = latlon[1];

	// API Calls
	const apiKey = process.env.API_KEY;
	const weather_url = `https://api.darksky.net/forecast/${apiKey}/${lat},${lon}?units=si`;
	// fetch API is part of the client side browser API.
	// to be able to use it. get pkg node-fetch
	console.log('getting weather');
	const weather_response = await fetch(weather_url);
	const weather_json = await weather_response.json();

	// Air quality API
	const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
	console.log('getting air');
	const aq_response = await fetch(aq_url);
	const aq_json = await aq_response.json();

	const api_data = {
		weather: weather_json,
		air_quality: aq_json
	}

	console.log('sending api data');
	response.json(api_data);
});
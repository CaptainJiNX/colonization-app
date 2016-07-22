'use strict';

const request = require('request');
const serviceHost = process.env.SPACESHIP_HOST || 'localhost:1337';

const launchShip = (target) => new Promise((resolve, reject) => {
	request({ 
		url: `http://${serviceHost}/launch`,
		method: 'POST',
		json: {
			shipCode: target.shipCode,
			destination: {
				latitude: target.latitude,
				longitude: target.longitude
			}
		}
	}, (err, resp) => {
		if(err || resp.statusCode === 500) reject('SHIP FAILURE');
		if(resp.statusCode === 403) reject('SHIP BUSY');
		if(resp.statusCode === 404) reject('UNKNOWN SHIP');
		resolve(resp.body);
	});
});

module.exports = { launchShip };
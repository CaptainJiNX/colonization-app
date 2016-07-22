'use strict';

const request = require('request');
const serviceHost = process.env.TARGETING_HOST || 'localhost:1338';

const getTarget = (name) => new Promise((resolve, reject) => {
	request({ 
		url: `http://${serviceHost}/target/${name}`, 
		json: true
	}, (err, resp) => {
		if(err || resp.statusCode === 500) reject('TARGET FAILURE');
		if(resp.statusCode === 404) reject('UNKNOWN TARGET');
		resolve(resp.body);
	});
});

module.exports = { getTarget };
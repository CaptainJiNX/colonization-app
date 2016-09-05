'use strict';

const request = require('request');
const retry = require('retry');

const ensureArray = (value) => Array.isArray(value) ? value : [value];

const getResponseError = (err, response) => {
	if(err) {
		return err;
	}

	if(response && response.statusCode !== 200) {
		return new Error(`HTTP Error: ${response.statusCode}`);
	}
}

const toRequestPromise = (service) => new Promise((resolve, reject) => {
	const operation = retry.operation();
	operation.attempt(() => request(`http://${service}/healthcheck`, (err, response) => {
		const error = getResponseError(err, response);

		if (operation.retry(error)) {
			return;
		}

		if(error) {
			return reject(error)
		}

		resolve(service);
	}));
});

module.exports = (services) => Promise.all(ensureArray(services).map(toRequestPromise));

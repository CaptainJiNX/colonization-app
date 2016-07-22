'use strict';

const redis = require('redis');

let client;

module.exports = () => {
	if(!client) {
		client = redis.createClient({ host: process.env.REDIS_HOST });
	}

	return client;
};

'use strict';

const redis = require('redis');

module.exports = (redisHost) => {
	const client = redis.createClient({ host: redisHost });

	const setKey = (key, value) => new Promise((resolve, reject) => {
		client.set(key, JSON.stringify(value), (err, reply) => {
			if(err) {
				return reject(err);
			}
			resolve(reply);
		});
	});

	return {
		set: (data) => Promise.all(Object.keys(data).map((key) => setKey(key, data[key]))),

		clear: () => new Promise((resolve, reject) => {
			client.send_command('FLUSHDB', (err, reply) => {
				if(err) {
					return reject(err);
				}
				resolve(reply);
			});
		})
	}
};

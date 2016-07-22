'use strict';

const leftPad = require('left-pad');
const redis = require('redis');

const client = redis.createClient();

for (var i = 0; i < 1000; i++) {
	const key = `ABC${leftPad(i, 3, 0)}`;
	const ship = { code: key, status: 'ready' };

	client.set(key, JSON.stringify(ship), (err, reply) => {
		if(err) {
			console.error(err);
		}
		console.log(reply);
	});
}

'use strict';

const redisClient = require('./redisClient');

const getShip = (shipCode) => new Promise((resolve, reject) => {
	if(!shipCode) {
		return resolve(null);
	}

	redisClient().get(shipCode, (err, reply) => {
		if (err) {
			return reject(err);
		}

		try {
			resolve(reply && JSON.parse(reply));
		} catch (parseError) {
			reject(parseError);
		}
	})
});

const setStatus = (shipCode, status) => new Promise((resolve, reject) => {
	const ship = { code: shipCode, status };

	redisClient().set(shipCode, JSON.stringify(ship), (err) => {
		if (err) {
			return reject(err);
		}

		throw new Error('----------> BAM!!! <------------');

		resolve(ship);
	})
});

module.exports = { getShip, setStatus };

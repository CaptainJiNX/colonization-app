'use strict';

let targeting = require('./targeting');
let spaceship = require('./spaceship');

const validateLaunch = (launchResult) => new Promise((resolve, reject) => {
	if(launchResult.shipStatus !== 'launched') {
		return reject('SHIP_NOT_LAUNCHED');
	}

	resolve(launchResult);
});

const colonizeTarget = (name) => new Promise((resolve) => {
	targeting
		.getTarget(name)
		.then(spaceship.launchShip)
		.then(validateLaunch)

		.then(() => resolve({
			[name]: {
				status: 'COLONIZED'
			}
		}))

		.catch((err) => resolve({
			[name]: {
				status: 'NOT COLONIZED',
				reason: err
			}
		}));
});

const toObject = (acc, result) => Object.assign(acc, result);

const colonize = (targets) => Promise.all(targets.map(colonizeTarget))
	.then((results) => results.reduce(toObject, {}));

module.exports = { colonize };
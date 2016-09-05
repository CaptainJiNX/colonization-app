'use strict';

let shipRepository = require('./shipRepository');
let hardwareInterface = require('./hardwareInterface')

const errorWithHttpCode = (msg, httpCode) => {
	const error = new Error(msg);
	error.httpCode = httpCode;
	return error;
};

const validateShip = (ship) => {
	if(!ship) {
		return Promise.reject(errorWithHttpCode('Invalid ship code.', 404));
	}

	if(!ship.status || ship.status !== 'ready') {
		return Promise.reject(errorWithHttpCode('Ship is not ready for launch.', 403));
	}

	return ship;
};

const setShipAsLaunched = (ship) => shipRepository.setStatus(ship.code, 'launched');

const launch = (shipCode, destination) => shipRepository
	.getShip(shipCode)
	.then(validateShip)
	.then(hardwareInterface.startEngine)
	.then(hardwareInterface.sendShipTo(destination))
	.then(setShipAsLaunched);

module.exports = { launch };
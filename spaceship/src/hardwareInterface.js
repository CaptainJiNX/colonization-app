'use strict';

// |================================================================
// | Pretend this is some fancy (and slow) hardware integration... |
// |================================================================

const startEngine = (ship) => new Promise((resolve) => {
	// --------------------------------------------
	// This will only be used for integration tests
	   if(process.env.INTEGRATION_TEST) return resolve(ship);
	// --------------------------------------------

	console.log('-=> STARTING ENGINE <=-');

	setTimeout(() => {
		console.log('-=> ENGINE STARTED <=-');
		resolve(ship);
	}, 5000);
});

const sendShipTo = (destination) => (ship) => new Promise((resolve) => {
	// --------------------------------------------
	// This will only be used for integration tests
	   if(process.env.INTEGRATION_TEST) return resolve(ship);
	// --------------------------------------------

	console.log('-=> MOVING SHIP TO DESTINATION <=-');
	console.log(' Destination:', JSON.stringify(destination, null, 2));

	setTimeout(() => {
		console.log('-=> SHIP MOVED <=-');
		resolve(ship);
	}, 5000);
});

module.exports = { startEngine, sendShipTo };
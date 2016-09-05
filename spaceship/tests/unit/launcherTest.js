'use strict';

const expect = require('chai').expect;
const rewire = require('rewire');
const launcher = rewire('../../src/launcher');

const mockRepository = {
	getShip: (shipCode) => {
		switch(shipCode) {
			case 'ABC123':
				return Promise.resolve({ code: shipCode, status: 'ready' });
			case 'DEF456':
				return Promise.resolve({ code: shipCode, status: 'launched' });
			default:
				return Promise.resolve(null);
		}
	},
	setStatus: (shipCode, status) => Promise.resolve({ code: shipCode, status })
};

const mockInterface = {
	startEngine: (ship) => Promise.resolve(ship),
	sendShipTo: (destination) => (ship) => Promise.resolve(ship)
};

describe('launcher', () => {
	before(() => {
		launcher.__set__('shipRepository', mockRepository);
		launcher.__set__('hardwareInterface', mockInterface);
	});

	describe('when launching a ship', () => {
		let launchResult;

		before(() => launcher.launch(
			'ABC123', {
				latitude: 59.3293,
				longitude: 18.0686
			}).then((result) => {
				launchResult = result
			}));

		it('should launch a ship', () => {
			expect(launchResult.status).to.equal('launched');
		})
	});

	describe('when launching an already launched ship', () => {
		let error;

		before(() => launcher.launch(
			'DEF456', {
				latitude: 59.3293,
				longitude: 18.0686
			}).catch((err) => {
				error = err;
			}));

		it('should return an error', () => {
			expect(error).to.exist;
		})
	});

	describe('when trying to launch a non existing ship', () => {
		let error;

		before(() => launcher.launch(
			'XYZ999', {
				latitude: 59.3293,
				longitude: 18.0686
			}).catch((err) => {
				error = err;
			}));

		it('should return an error', () => {
			expect(error).to.exist;
		})
	});
});

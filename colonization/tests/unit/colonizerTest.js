'use strict';

const expect = require('chai').expect;
const rewire = require('rewire');

const colonizer = rewire('../../src/colonizer');

const targetOK = { getTarget: () => Promise.resolve() };
const targetFail = { getTarget: () => Promise.reject('TARGET_FAIL') };

const shipLaunched = { launchShip: () => Promise.resolve({ shipStatus: 'launched' }) };
const shipNotLaunched = { launchShip: () => Promise.resolve({ shipStatus: 'nope...' }) };
const shipFail = { launchShip: () => Promise.reject('SHIP_FAIL') };

describe('colonizer', () => {

	describe('when targeting is fine', () => {
		before(() => {
			colonizer.__set__('targeting', targetOK);
		});

		describe('and ship is launched', () => {
			before(() => {
				colonizer.__set__('spaceship', shipLaunched);
			});

			it('should colonize', () => {
				return colonizer.colonize(['ANY']).then((result) => {
					expect(result.ANY.status).to.equal('COLONIZED');
				});
			});
		});

		describe('but ship launch was not verified', () => {
			before(() => {
				colonizer.__set__('spaceship', shipNotLaunched);
			});

			it('should not colonize', () => {
				return colonizer.colonize(['ANY']).then((result) => {
					expect(result.ANY.status).to.equal('NOT COLONIZED');
					expect(result.ANY.reason).to.equal('SHIP_NOT_LAUNCHED');
				});
			});
		});

		describe('but ship launch fails', () => {
			before(() => {
				colonizer.__set__('spaceship', shipFail);
			});

			it('should not colonize', () => {
				return colonizer.colonize(['ANY']).then((result) => {
					expect(result.ANY.status).to.equal('NOT COLONIZED');
					expect(result.ANY.reason).to.equal('SHIP_FAIL');
				});
			});
		});
	});

	describe('when targeting fails', () => {
		before(() => {
			colonizer.__set__('targeting', targetFail)
		});

		it('should not colonize', () => {
			return colonizer.colonize(['ANY']).then((result) => {
				expect(result.ANY.status).to.equal('NOT COLONIZED');
				expect(result.ANY.reason).to.equal('TARGET_FAIL');
			});
		});
	});
});

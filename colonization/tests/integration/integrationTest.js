'use strict';

const expect = require('chai').expect;
const request = require('request');

const waitFor = require('../tools/waitfor-service');
const testData = require('../tools/testData');

const colonize = (targets, responseHandler) => (done) => {
	request({ 
		url: 'http://colonization/colonize',
		method: 'POST',
		json: { 
			targets
		}
	}, (err, resp) => {
		responseHandler(resp);
		done(err);
	});
};

describe('colonization', () => {
	before(() => waitFor(['colonization', 'spaceship', 'targeting', 'targeting-s3:8000']));

	describe('healthcheck', () => {
		let response;

		before((done) => {
			request({ url: 'http://colonization/healthcheck', json: true }, (err, resp) => {
				response = resp;
				done(err);
			});
		});

		it('should respond with http status 200', () => {
			expect(response.statusCode).to.equal(200);
		});
	});

	describe('with some spaceship test data', () => {

		const shipTestData = {
			'ABC123': { code: 'ABC123', status: 'ready' },
			'DEF456': { code: 'DEF456', status: 'ready' },
			'GHI789': { code: 'GHI789', status: 'launched' }
		};

		beforeEach(() => testData('spaceship-redis').set(shipTestData));
		afterEach(() => testData('spaceship-redis').clear());

		describe('colonize stockholm', () => {
			let response;

			beforeEach(colonize(['stockholm'], (resp) => {
				response = resp;
			}));

			it('should respond with http status 200', () => {
				expect(response.statusCode).to.equal(200);
			});

			it('should succeed to colonize', () => {
				expect(response.body.stockholm).to.eql({
					status: 'COLONIZED'
				});
			});
		});

		describe('colonize korpilombolo', () => {
			let response;

			beforeEach(colonize(['korpilombolo'], (resp) => {
				response = resp;
			}));

			it('should respond with http status 200', () => {
				expect(response.statusCode).to.equal(200);
			});

			it('should fail to colonize', () => {
				expect(response.body.korpilombolo).to.eql({
					status: 'NOT COLONIZED',
					reason: 'SHIP BUSY'
				});
			});
		});

		describe('colonize helsinki', () => {
			let response;

			beforeEach(colonize(['helsinki'], (resp) => {
				response = resp;
			}));

			it('should respond with http status 200', () => {
				expect(response.statusCode).to.equal(200);
			});

			it('should fail to colonize', () => {
				expect(response.body.helsinki).to.eql({
					status: 'NOT COLONIZED',
					reason: 'UNKNOWN SHIP'
				});
			});
		});

		describe('colonize invalid target', () => {
			let response;

			beforeEach(colonize(['invalid-target'], (resp) => {
				response = resp;
			}));

			it('should respond with http status 200', () => {
				expect(response.statusCode).to.equal(200);
			});

			it('should fail to colonize', () => {
				expect(response.body['invalid-target']).to.eql({
					status: 'NOT COLONIZED',
					reason: 'TARGET FAILURE'
				});
			});
		});

		describe('colonize unknown target', () => {
			let response;

			beforeEach(colonize(['unknown'], (resp) => {
				response = resp;
			}));

			it('should respond with http status 200', () => {
				expect(response.statusCode).to.equal(200);
			});

			it('should fail to colonize', () => {
				expect(response.body.unknown).to.eql({
					status: 'NOT COLONIZED',
					reason: 'UNKNOWN TARGET'
				});
			});
		});

		describe('colonize multiple targets', () => {
			let response;

			beforeEach(colonize(['stockholm', 'lund', 'korpilombolo', 'helsinki'], (resp) => {
				response = resp;
			}));

			it('should respond with http status 200', () => {
				expect(response.statusCode).to.equal(200);
			});

			it('should report status for all targets', () => {
				expect(response.body).to.eql({
					stockholm: {
						status: "COLONIZED"
					},
					lund: {
						status: "COLONIZED"
					},
					korpilombolo: {
						status: "NOT COLONIZED",
						reason: "SHIP BUSY"
					},
					helsinki: {
						status: "NOT COLONIZED",
						reason: "UNKNOWN SHIP"
					}
				});
			});
		});
	});
});

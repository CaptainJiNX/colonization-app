'use strict';

const expect = require('chai').expect;
const request = require('request');

const waitFor = require('../tools/waitfor-service');
const testData = require('../tools/testData');

describe('spaceship', () => {
	before(() => waitFor('spaceship'));

	describe('healthcheck', () => {
		let response;

		beforeEach((done) => {
			request({ url: 'http://spaceship/healthcheck', json: true }, (err, resp) => {
				response = resp;
				done(err);
			});
		});

		it('should respond with http status 200', () => {
			expect(response.statusCode).to.equal(200);
		});
	});

	describe('with some test data', () => {

		const shipTestData = {
			'ABC123': { code: 'ABC123', status: 'ready' },
			'DEF456': { code: 'DEF456', status: 'launched' }
		};

		beforeEach(() => testData('spaceship-redis').set(shipTestData));
		afterEach(() => testData('spaceship-redis').clear());

		describe('launch a ship that is ready', () => {
			let response;

			beforeEach((done) => {
				request({ 
					url: 'http://spaceship/launch',
					method: 'POST',
					json: {
						shipCode: 'ABC123',
						destination: {
							latitude: 59.3293,
							longitude: 18.0686
						}
					}
				}, (err, resp) => {
					response = resp;
					done(err);
				});
			});

			it('should respond with http status 200', () => {
				expect(response.statusCode).to.equal(200);
			});

			it('should return shipCode', () => {
				expect(response.body.shipCode).to.equal('ABC123');
			});

			it('should return shipStatus', () => {
				expect(response.body.shipStatus).to.equal('launched');
			});
		});

		describe('launch a ship twice', () => {

			const launch = { 
				url: 'http://spaceship/launch',
				method: 'POST',
				json: {
					shipCode: 'ABC123',
					destination: {
						latitude: 59.3293,
						longitude: 18.0686
					}
				}
			};

			let response;

			beforeEach((done) => {
				request(launch, (err, resp) => {
					expect(resp.statusCode).to.equal(200);

					request(launch, (err, resp) => {
						response = resp;
						done(err);
					});
				});
			});

			it('should respond with http status 403', () => {
				expect(response.statusCode).to.equal(403);
			});

			it('should return reason', () => {
				expect(response.body).to.contain('not ready');
			});
		});

		describe('launch a ship that is not ready', () => {
			let response;

			beforeEach((done) => {
				request({ 
					url: 'http://spaceship/launch',
					method: 'POST',
					json: {
						shipCode: 'DEF456',
						destination: {
							latitude: 59.3293,
							longitude: 18.0686
						}
					}
				}, (err, resp) => {
					response = resp;
					done(err);
				});
			});

			it('should respond with http status 403', () => {
				expect(response.statusCode).to.equal(403);
			});

			it('should return reason', () => {
				expect(response.body).to.contain('not ready');
			});
		});

		describe('launch a ship that does not exist', () => {
			let response;

			beforeEach((done) => {
				request({ 
					url: 'http://spaceship/launch',
					method: 'POST',
					json: {
						shipCode: 'XYZ999',
						destination: {
							latitude: 59.3293,
							longitude: 18.0686
						}
					}
				}, (err, resp) => {
					response = resp;
					done(err);
				});
			});

			it('should respond with http status 404', () => {
				expect(response.statusCode).to.equal(404);
			});

			it('should return reason', () => {
				expect(response.body).to.contain('Invalid ship code');
			});
		});
	});
});

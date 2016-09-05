'use strict';

const expect = require('chai').expect;
const request = require('request');

const waitFor = require('../tools/waitfor-service');

describe('targeting', () => {
	before(() => waitFor(['targeting', 'targeting-s3:8000']));

	describe('healthcheck', () => {
		let response;

		before(done => {
			request({ url: 'http://targeting/healthcheck', json: true }, (err, resp) => {
				response = resp;
				done(err);
			});
		});

		it('should respond with http status 200', () => {
			expect(response.statusCode).to.equal(200);
		});
	});

	describe('valid target', () => {
		let response;

		before(done => {
			request({ url: 'http://targeting/target/stockholm', json: true }, (err, resp) => {
				response = resp;
				done(err);
			});
		});

		it('should respond with http status 200', () => {
			expect(response.statusCode).to.equal(200);
		});

		it('should return ship code', () => {
			expect(response.body.shipCode).to.equal('ABC123');
		});

		it('should return latitude', () => {
			expect(response.body.latitude).to.equal('59.3293');
		});

		it('should return longitude', () => {
			expect(response.body.longitude).to.equal('18.0686');
		});
	});

	describe('badly formatted target', () => {
		let response;

		before(done => {
			request({ url: 'http://targeting/target/gothenburg', json: true }, (err, resp) => {
				response = resp;
				done(err);
			});
		});

		it('should respond with http status 500', () => {
			expect(response.statusCode).to.equal(500);
		});
	});

	describe('non existing target', () => {
		let response;

		before(done => {
			request({ url: 'http://targeting/target/this-does-not-exist', json: true }, (err, resp) => {
				response = resp;
				done(err);
			});
		});

		it('should respond with http status 404', () => {
			expect(response.statusCode).to.equal(404);
		});
	});
});

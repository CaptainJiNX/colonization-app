'use strict';

const expect = require('chai').expect;
const assert = require('chai').assert;
const rewire = require('rewire');

const getObjWith = (err, resp) => (opt, cb) => cb(err, resp);

const mockedAWS = (getObject) => ({
	S3: function () { return { getObject }; }
});

describe('targetLocator', () => {
	describe('when response is OK', () => {
		const createTargetLocator = rewire('../../src/targetLocator');
		let targets;

		before(() => {
			createTargetLocator.__set__('AWS', mockedAWS(getObjWith(null, { Body: 'ABC;12.345;67.890' })));
			targets = createTargetLocator();
		});

		it('should return the target', () => targets.get('ANY')
			.then(result => expect(result).to.eql({ ship: 'ABC', latitude: '12.345', longitude: '67.890' })));
	});

	describe('when response does not have enough fields', () => {
		const createTargetLocator = rewire('../../src/targetLocator');
		let targets;

		before(() => {
			createTargetLocator.__set__('AWS', mockedAWS(getObjWith(null, { Body: 'ABC;12.345' })));
			targets = createTargetLocator();
		});

		it('should fail with an error', () => targets.get('ANY')
			.then(assert.fail)
			.catch((err) => expect(err.message).to.eql('Target could not be parsed.')))
	});

	describe('when latitude is not a number', () => {
		const createTargetLocator = rewire('../../src/targetLocator');
		let targets;

		before(() => {
			createTargetLocator.__set__('AWS', mockedAWS(getObjWith(null, { Body: 'ABC;xxx;67.890' })));
			targets = createTargetLocator();
		});

		it('should fail with an error', () => targets.get('ANY')
			.then(assert.fail)
			.catch((err) => expect(err.message).to.eql('Target could not be parsed.')))
	});

	describe('when longitude is not a number', () => {
		const createTargetLocator = rewire('../../src/targetLocator');
		let targets;

		before(() => {
			createTargetLocator.__set__('AWS', mockedAWS(getObjWith(null, { Body: 'ABC;12.345;xxx' })));
			targets = createTargetLocator();
		});

		it('should fail with an error', () => targets.get('ANY')
			.then(assert.fail)
			.catch((err) => expect(err.message).to.eql('Target could not be parsed.')))
	});

	describe('when response is Error', () => {
		const createTargetLocator = rewire('../../src/targetLocator');
		let targets;

		before(() => {
			createTargetLocator.__set__('AWS', mockedAWS(getObjWith(new Error('BAM!'))));
			targets = createTargetLocator();
		});

		it('should fail with the error', () => targets.get('ANY')
			.then(assert.fail)
			.catch((err) => expect(err.message).to.eql('BAM!')))
	});
});

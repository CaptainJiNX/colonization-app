'use strict';

const AWS = require('aws-sdk');

module.exports = () => {
	const s3 = new AWS.S3();

	return {
		get: (targetName) => new Promise((resolve, reject) => {
			s3.getObject({
				Bucket: 'ctjinx',
				Key: `targets/${targetName}.csv`
			}, (err, response) => {
				if(err) {
					if(err.code === 'NoSuchKey') {
						err.httpCode = 404;
					}

					return reject(err);
				}

				const splitBody = response.Body.toString().split(';');

				const shipCode = splitBody[0];
				const latitude = splitBody[1];
				const longitude = splitBody[2];

				if(splitBody.length < 3 || isNaN(latitude) || isNaN(longitude)) {
					return reject(new Error('Target could not be parsed.'));
				}

				resolve({ shipCode, latitude, longitude });
			});
		})
	};
};
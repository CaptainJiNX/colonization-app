'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const colonizer = require('./src/colonizer');

const app = express();

app.use(bodyParser.json());

app.get('/healthcheck', (req, res) => {
	res.json({ healthy: true });
});

app.post('/colonize', (req, res) => {
	colonizer.colonize(req.body.targets)
		.catch((err) => res.status(err.httpCode).send(err.message))
		.then((result) => res.json(result));
});

const port = process.env.EXTERNAL_PORT || 1339;

app.listen(port, () => console.log(`Listening on port ${port}...`));

process.once('SIGTERM', process.exit);

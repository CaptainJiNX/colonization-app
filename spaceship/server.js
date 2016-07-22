'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const launcher = require('./src/launcher');
const redisClient = require('./src/redisClient');

const app = express();

app.use(bodyParser.json());

app.get('/healthcheck', (req, res) => {
	res.json({ healthy: true });
});

app.post('/launch', (req, res) => {
	launcher.launch(req.body.shipCode, req.body.destination)
		.catch((err) => res.status(err.httpCode || 500).send(err.message))
		.then((ship) => res.json({
			shipCode: ship.code,
			shipStatus: ship.status
		}));
});

const port = process.env.EXTERNAL_PORT || 1337;

redisClient().on('ready', () => {
	app.listen(port, () => console.log(`Listening on port ${port}...`));
});

process.once('SIGTERM', process.exit);

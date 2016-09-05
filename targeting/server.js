'use strict';

const express = require('express');
const app = express();
const targetLocator = require('./src/targetLocator')();

app.get('/healthcheck', (req, res) => {
	res.json({ healthy: true });
});

app.get('/target/:name', (req, res) => {
	targetLocator.get(req.params.name)
		.catch((err) => res.status(err.httpCode || 500).send(err.message))
		.then((target) => res.json(target));
});


let port = process.env.EXTERNAL_PORT || 80;

app.listen(port, () => console.log(`Listening on port ${port}...`));

process.once('SIGTERM', process.exit);

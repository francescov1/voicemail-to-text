'use strict';
Promise = require('bluebird');
const config = require('./config');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const routes = require('./routes');
const errors = require('./errors/middleware');

const app = express();

// basic middleware
app.use(helmet());
app.use(bodyParser.json());

// routes
app.use(routes)

// error handling middleware
app.use(errors);

// catch all route
app.all("*", (req, res) => res.status(200).send("Voicemail to text API"));

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}...`)
});

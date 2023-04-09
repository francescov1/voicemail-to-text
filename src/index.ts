Promise = require('bluebird');
import config from './config'
import express from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
const logger = require("morgan");

import routes from './routes'
import { errorHandler } from './errors/middleware'

const app = express();

// basic middleware
app.use(helmet());
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

// routes
app.use(routes)

// error handling middleware
app.use(errorHandler);

// catch all route
app.all("*", (req, res) => res.status(200).send("Voicemail to text API"));

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}...`)
});

'use strict';
const express = require('express');
const exampleRoutes = require('./examples');

module.exports = function(app) {
  // mount api routes on to api router
  const apiRouter = express.Router();
  apiRouter.use('/examples', exampleRoutes);

  // mount api router on to app
  app.use('/api', apiRouter);

};

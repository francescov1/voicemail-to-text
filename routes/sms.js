'use strict';
const config = require('../config');
const express = require('express');
const router = express.Router();

const client = require('../config/twilio');
const calls = require('../helpers/calls');
const dialog = require('../helpers/dialog');

router.post('/getVoicemail', async (req, res, next) => {
  // remove '+' from number
  const number = req.body.From.slice(1);

  // either "read" or "delete {n1} {n2} ..."
  const message = req.body.Body.toLowerCase().trim().split(' ');

  await calls.accessVoicemail(number, message);
  return res.end();
});

module.exports = router;

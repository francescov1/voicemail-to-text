'use strict';
const config = require('../config/index');
const express = require('express');
const router = express.Router();

const client = require('../config/twilio');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

router.post('/initialCallHandler', async (req, res, next) => {
  const message = req.query.message;
  const response = new VoiceResponse();

  // press pound key when call begins
  response.play({
    digits: '#'
  });

  // enter password
  response.play({
    digits: config.voice_password[0] + 'www' + config.voice_password.slice(1)
  });

  res.type('text/xml');
  res.send(response.toString());
});

module.exports = router;

'use strict';
const config = require('../config');
const express = require('express');
const router = express.Router();

const client = require('../config/twilio');
const calls = require('../helpers/calls');
const dialog = require('../helpers/dialog');

// TODO: Look at price for every execution, decide if its worth checking regularly, or just leave it up to user to initiate via sms
// TODO: Deploy to cloud to start testing better

router.post('/getVoicemail', async (req, res, next) => {
  // remove '+' from number
  const number = req.body.From.slice(1);

  // TODO: To throw error, need to send an SMS message back to user
  if (req.body.From !== config.personal_number) {
    throw new Error("Invalid sender")
  }

  if (!/^read$|^delete( [0-9]{1,2})+/.test(req.body.Body)) {
    throw new Error("Invalid message format. Please use 'read' or 'delete {n1} {n2} ...'")
  }
  
  const message = req.body.Body.toLowerCase().trim().split(' ');

  await calls.accessVoicemail(number, message);
  return res.end();
});

module.exports = router;

'use strict';
const config = require('../config');
const express = require('express');
const router = express.Router();

const client = require('../config/twilio');
const calls = require('../helpers/calls');
const dialog = require('../helpers/dialog');

// TODO: Resolve todos, cleanup code, make sure everything works properly, finish delete command.
// TODO: Look at price for every execution, decide if its worth checking regularly, or just leave it up to user to initiate via sms

router.post('/getVoicemail', async (req, res, next) => {
  // remove '+' from number
  const number = req.body.From.slice(1);

  // TODO: To throw error, need to send an SMS message back to user.
  if (req.body.From !== config.personal_number) {
    throw new Error("Invalid sender")
  }

  const command = req.body.Body.toLowerCase().trim();

  if (!/^read$|^delete( [0-9]{1,2})+/.test(command)) {
    throw new Error("Invalid message format. Please use 'read' or 'delete {n1} {n2} ...'")
  }
  
  const message = command.split(' ');

  await calls.accessVoicemail(number, message);
  return res.end();
});

module.exports = router;

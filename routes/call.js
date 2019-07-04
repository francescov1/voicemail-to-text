'use strict';
const config = require('../config/index');
const express = require('express');
const router = express.Router();

const client = require('../config/twilio');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

// responsemail breakdown (rogers)

// dialog: "welcome to rogers wireless responsemail. Please enter your password"
// action: send password digits
// dialog (if new messages): "you have _ new wireless response messages."
// dialog (if saved message): "you have _ saved messages."

// if new messages
// dialog : "First new message:"
// dialog: "{message}"
// dialog: "to erase this message, press 7, to reply to it, press 8, to save it, press 9"
// dialog: "next message"
// dialog: "{message}"
// dialog: "to erase this message, press 7, to reply to it, press 8, to save it, press 9"

// if saved messages
// dialog: "First saved message:"
// dialog: "{message}"
// dialog: "to erase this message, press 7, to reply to it, press 8, to save it, press 9"
// dialog: "next saved message"
// dialog: "{message}"
// dialog: "to erase this message, press 7, to reply to it, press 8, to save it, press 9"

// dialog (after messages play): "end of messages."
// dialog (replays 3 times if no response): "main menu. to check your wireless response messages,
//    press 1, to send a response message press 3, to change your personal options, press 4,
//    to exit, press star"

// dialog: "thank you for calling, goodbye."

// if deleting messages:
// action: send digit "7" right after message starts
// dialog: "message erased, next message"
// dialog: "{message}"
// continue same flow as above

router.post('/initialCallHandler', async (req, res, next) => {
  const response = new VoiceResponse();

  // press pound key when call begins
  response.play({
    digits: '#'
  });

  // enter password
  response.play({
    digits: config.voice_password[0] + 'www' + config.voice_password.slice(1)
  });

  console.log(response.toString());

  res.type('text/xml');
  res.send(response.toString());
});

module.exports = router;

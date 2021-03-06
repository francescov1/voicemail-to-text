'use strict';
const config = require('../config');
const client = require('../config/twilio');
const dialog = require('../helpers/dialog');

const express = require('express');
const router = express.Router();

const VoiceResponse = require('twilio').twiml.VoiceResponse;

router.post('/initialCallHandler', async (req, res, next) => {
  const { number, message } = req.query;
  console.log('sending data to call');
  console.log('number: ' + number);
  console.log('message: ' + message);

  const response = new VoiceResponse();

  response.play({ digits: number.slice(-10) });

  response.pause({ length: 10 });

  response.play({ digits: config.voice_password });

  // record the voicemail and send for parsing
  const record = response.record({
    action: `${config.base_url}/call/${message.split(' ')[0]}?number=${number}`,
    method: 'POST',
    timeout: 20,
    maxLength: 7200,
    transcribe: true,
    transcribeCallback: `${config.base_url}/call/${message.split(' ')[0]}?number=${number}`,
  });

  res.type('text/xml');
  res.send(response.toString());
});

router.post('/read', async (req, res, next) => {
  console.log('parsing voicemail dialog');
  console.log('req.body received:');
  console.log(req.body);
  if (!req.body.TranscriptionUrl) {
    console.log('recording callback, ending function')
    return res.end();
  }

  const voicemailDialog = req.body.TranscriptionText;
  const number = req.query.number;

  // TODO: check whos number, may nee to adjust the speech to text based
  // on which service provider

  // for now assume its rogers

  const voicemails = dialog.parseVoicemail(voicemailDialog);

  // TODO: get sender
  let response = `New voicemails: ${voicemails.new.n}\n`;
  let counter = 1;
  for (let msg of voicemails.new.messages) {
    response += `\n${counter} - ${msg}`;
    counter++;
  }

  response += `\n\nSaved voicemails: ${voicemails.saved.n}\n`;

  for (let msg of voicemails.saved.messages) {
    response += `\n${counter} - ${msg}`;
    counter++;
  }

  try {
    const message = await client.messages.create({
      body: response,
      from: config.twilio.sender_id,
      to: number
    });

    return res.end();
  }
  catch(err) { return next(err) }
});

// TODO:
router.post('/delete', async (req, res, next) => {
  const voicemailDialog = req.body.dialog;
  const number = req.body.number;
  const voicemailsToDelete = req.body.delete;

  const voicemails = dialog.parseMessages(voicemailDialog);
});

module.exports = router;

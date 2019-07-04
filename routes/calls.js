'use strict';
const config = require('../config/index');
const express = require('express');
const router = express.Router();

const client = require('../config/twilio');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

router.post('/initialCallHandler', async (req, res, next) => {
  const { number, message } = req.query;

  const response = new VoiceResponse();

  // press pound key when call begins
  response.play({
    digits: '#'
  });

  // enter password
  response.play({
    digits: config.voice_password[0] + 'www' + config.voice_password.slice(1)
  });

  // gather the voicemail and send for parsing
  const gather = response.gather({
    input: 'speech',
    action: config.base_url + '/call/' + message.split(' ')[0],
    finishOnKey: '',
    hints: 'to erase this message press 7 to reply to it press 8 to save it press 9, next message, first saved message, next saved message, first new message, next message, end of messages, new wireless voice messages, saved messages'
  });

  res.type('text/xml');
  res.send(response.toString());
});

router.post('/read', async (req, res, next) => {
  const voicemailDialog = req.body.dialog;
  const number = req.body.number;

  // TODO: check whos number, may nee to adjust the speech to text based
  // on which service provider

  // for now assume its rogers

  const voicemails = dialog.parseMessages(voicemailDialog);

  // TODO: get sender
  response = `New voicemails: ${voicemails.new.n}\n`;
  let counter = 1;
  for (let msg of voicemails.new.messages) {
    response += `\n${counter} - ${msg}`
    counter++
  }

  response += `\n\nSaved voicemails: ${voicemails.saved.n}\n`

  for (let msg of voicemails.saved.messages) {
    response += `\n${counter} - ${msg}`
    counter++
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

})

// TODO:
router.post('/delete', async (req, res, next) => {
  const voicemailDialog = req.body.dialog;
  const number = req.body.number;
  const voicemailsToDelete = req.body.delete;

  const voicemails = dialog.parseMessages(voicemailDialog);

})

module.exports = router;

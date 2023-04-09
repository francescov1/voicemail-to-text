'use strict';
const config = require('../config');
const client = require('../config/twilio');
const dialog = require('../helpers/dialog');

const express = require('express');
const router = express.Router();

const VoiceResponse = require('twilio').twiml.VoiceResponse;

router.post('/initialCallHandler', async (req, res, next) => {
  try {
    const { number, message } = req.query;
    console.log("Received initial call handler callback, responding with TwiML")
    console.log('number: ' + number);
    console.log('message: ' + message);

    const response = new VoiceResponse();

    response.pause({ length: 5 });

    // NOTE: Can add "w" between digits for a 0.5 second pause
    response.play({ digits: number.slice(-10) });

    response.pause({ length: 10 });

    response.play({ digits: config.voice_password });

    const transcriptionCallbackUrl = `${config.base_url}/call/${message.split(' ')[0]}?number=${number}`
    console.log("Sending recording transcription callback to URL " + transcriptionCallbackUrl);

    // record the voicemail and send for parsing
    const record = response.record({
      // TODO: This implementation is messy, clean up. Essentially were getting the command "read" or "delete" from the API call and then using it as the route path
      action: transcriptionCallbackUrl,
      method: 'POST',
      timeout: 20,
      maxLength: 7200,
      transcribe: true,
      transcribeCallback: transcriptionCallbackUrl
    });

    res.type('text/xml');
    res.send(response.toString());
  }
  catch(err) {
    return next(err)
  }
});

router.post('/read', async (req, res, next) => {
  try {
    if (!req.body.TranscriptionUrl) {
      // This gets called when the recording completes but before the transcript is done
      console.log('No transcript URL present, ignoring request')
      return res.end();
    }

    const voicemailDialog = req.body.TranscriptionText;
    const number = req.query.number;

    console.log('Parsing voicemail dialog: ', voicemailDialog);
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
  try {

    const voicemailDialog = req.body.dialog;
    const number = req.body.number;
    const voicemailsToDelete = req.body.delete;
    
    const voicemails = dialog.parseMessages(voicemailDialog);
  }
  catch(err) {
    return next(err)
  }
});

module.exports = router;

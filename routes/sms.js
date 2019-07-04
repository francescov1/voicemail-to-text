'use strict';
const config = require('../config');
const express = require('express');
const router = express.Router();

const client = require('../config/twilio');
const calls = require('../helpers/calls');
const dialog = require('../helpers/dialog');

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

router.post('/getVoicemail', async (req, res, next) => {
  console.log('req.body:')
  console.log(req.body)

  const number = req.body.From;

  // either "read" or "delete {n1} {n2} ..."
  const message = req.body.Body.toLowerCase().trim().split(' ');

  await calls.accessVoicemail(number, message);
  return res.end();
});

module.exports = router;

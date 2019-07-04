'use strict';
const config = require('../config');
const express = require('express');
const router = express.Router();

const client = require('../config/twilio');
const calls = require('../helpers/calls');

router.post('/receive', async (req, res, next) => {
  const number = req.body.From;
  const message = req.body.Body.toLowerCase().trim().split(' ');

  // TODO: check whos number, may nee to adjust the speech to text based
  // on which service provider

  // for now assume its rogers

  // TODO: decide on certain keywords for actions from voicemail
  // such as read voicemails, delete voicemail
  let response;
  switch (message[0]) {
    case "read":
      await calls.accessVoicemail(number);
      // call number, get voicemail, relay back
      response = `Number of voicemails: {n_voicemails}\n\n1 - Left from {sender_number}\nMessage: {message}`
      break;
    case "delete":
      // call number, get voicemail, loop through rest of message array and delete
      // numbers provided
      response = `Voicemails ${message.slice(0)} deleted successfully.`
      break;
    default:
      response = `'${message[0]}' is an invalid command.\n\nAvailable commands:\READ - Reply with all voicemails\DELETE {n1} {n2} ... - Delete voicemails'`
      break;
  }

  // number each voicemail so user can text back which
  // voicemail to delete
  console.log('req.body:')
  console.log(req.body)

  try {
    const message = await client.messages.create({
      body: response,
      from: config.twilio.sender_id,
      to: number
    });

    return res.end();
  }
  catch(err) { next(err) }

});

module.exports = router;

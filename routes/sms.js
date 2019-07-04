'use strict';
const config = require('../config');
const express = require('express');
const router = express.Router();

const client = require('../config/twilio');

router.post('/receive', async (req, res, next) => {
  const number = req.body.From;
  const message = req.body.Body;

  // TODO: check whos number, may nee to adjust the speech to text based
  // on which service provider

  // for now assume its rogers

  // TODO: decide on certain keywords for actions from voicemail
  // such as read voicemails, delete voicemail

  // number each voicemail so user can text back which
  // voicemail to delete
  console.log('req.body:')
  console.log(req.body)

  try {
    const message = await client.messages.create({
      body: `Relaying voicemail back to you!`,
      from: config.twilio.sender_id,
      to: number
    });

    return res.end();
  }
  catch(err) { next(err) }

});

module.exports = router;

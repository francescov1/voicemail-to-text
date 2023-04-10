import config from '../config'
import twilioClient from '../config/twilio'
import * as dialog from '../helpers/dialog'
import twilio from 'twilio'
import express from 'express'

const router = express.Router();

const {VoiceResponse} = twilio.twiml;

router.post('/initialCallHandler', async (req, res, next) => {
  try {
    const { number, message } = req.query as { number: string, message: string };
    console.log(`Received initial call handler callback from number "${number}" with message "${message}". Responding with TwiML...`)

    const response = new VoiceResponse();

    response.play({ digits: "ww#" });
    response.play({ digits: `ww${config.voice_password}` });

    // TODO: This implementation is messy, clean up. Essentially were getting the command "read" or "delete" from the API call and then using it as the route path
    const transcriptionCallbackUrl = `${config.base_url}/call/${message.split(' ')[0]}?number=${number}`
    console.log("Sending recording transcription callback to URL " + transcriptionCallbackUrl);

    response.record({
      action: transcriptionCallbackUrl,
      method: 'POST',
      timeout: 30,
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

// TODO: An easier way to parse voicemail would be to gather every automated message. But pauses might be inconsistent. Could have one func which just looks for the automated stuff

router.post('/read', async (req, res, next) => {
  try {
    if (!req.body.TranscriptionText) {
      // This gets called when the recording completes but before the transcript is done
      console.log('No TranscriptionText present, ignoring request')
      return res.end();
    }

    const voicemailDialog = req.body.TranscriptionText as string;
    const phoneNumber = req.query.number as string;

    console.log(`Parsing voicemail dialog: ` + voicemailDialog);
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
    const message = await twilioClient.messages.create({
      body: response,
      from: config.twilio.sender_id,
      to: phoneNumber
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
    
    // const voicemails = dialog.parseMessages(voicemailDialog);
  }
  catch(err) {
    return next(err)
  }
});

export default router;

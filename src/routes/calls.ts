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

    // TODO: Figure out how to pause before call. Would be a lot easier if we can figure out how to listen in on calls, or save the audio file somewhere.
    // response.pause({ length: 1 });

    // NOTE: Can add "w" between digits for a 0.5 second pause
    response.play({ digits: number.slice(-10) });

    response.pause({ length: 10 });

    response.play({ digits: config.voice_password });

    // TODO: This implementation is messy, clean up. Essentially were getting the command "read" or "delete" from the API call and then using it as the route path
    const transcriptionCallbackUrl = `${config.base_url}/call/${message.split(' ')[0]}?number=${number}`
    console.log("Sending recording transcription callback to URL " + transcriptionCallbackUrl);

    // Using Record wasnt working well since the transcription was very inaccurate.
    // record the voicemail and send for parsing
    // const record = response.record({
    //   action: transcriptionCallbackUrl,
    //   method: 'POST',
    //   timeout: 20,
    //   maxLength: 7200,
    //   transcribe: true,
    //   transcribeCallback: transcriptionCallbackUrl
    // });

    // TODO: add phrases and hints
    // NOTE: Max gather time is 60s, but should be able to use multiple gather statements, could do one for each voicemail, or simply look at how long a call usually is and chain enough to cover that
    const gather = response.gather({
      action: transcriptionCallbackUrl,
      // NOTE: If this isnt effective, use google class tokens https://www.twilio.com/docs/voice/twiml/gather#hints
      // hints: "this is a phrase I expect to hear, keyword, product name, name", 
      input: ['speech'],
      method: 'POST',
      profanityFilter: false,
      timeout: 20, // amount of silence time to wait before stopping gather
      speechModel: 'phone_call', // Set to default if this isnt working as expected
      // enhanced: true, // uses a more accurate speech model, but more expensive
    })

    // gather.say('Please enter your account number,\nfollowed by the pound sign');
  
    res.type('text/xml');
    res.send(response.toString());
  }
  catch(err) {
    return next(err)
  }
});

router.post('/read', async (req, res, next) => {
  try {
    if (!req.body.SpeechResult) {
      // This gets called when the recording completes but before the transcript is done
      console.log('No SpeechResult present, ignoring request')
      console.log(req.body)
      return res.end();
    }

    // SpeechResult: "978 is not a recognized mailbox number set a buzz. When you mailed it wide book on you to access your own voicemail box, enter your phone number with area code then press pound to Lexi the above blood work as Evel, Knievel, the city of fun as a place to get syphilis. You're not really. So busy as",
    // Old method: 978 is not a recognized mailbox number nurse fit. We need buzzer and you know who the blood vocab. Hooking you to access your own voicemail box. Enter your phone number with area code. Then press, pound for like, city of to wed for gal convulsive oakland. You be able to telephone everglades gets if it is Janelle 3 at p. Yes. Over the years. Sorry. You're having trouble. Please try again later. This leak of was a pull. It is only me vase a you the new vo uh rita.

    const voicemailDialog = req.body.SpeechResult as string;
    const confidence = Number(req.body.Confidence);
    const phoneNumber = req.query.number as string;

    console.log(`Parsing voicemail dialog with confidence ${confidence}: ` + voicemailDialog);
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

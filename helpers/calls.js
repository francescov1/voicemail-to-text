'use strict';
const config = require('../config/index');
const client = require('../config/twilio');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

// voicemail breakdown (rogers)

// dialog: "welcome to rogers wireless voicemail. Please enter your password"
// action: send password digits
// dialog (if new messages): "you have _ new wireless voice messages."
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
// dialog (replays 3 times if no response): "main menu. to check your wireless voice messages,
//    press 1, to send a voice message press 3, to change your personal options, press 4,
//    to exit, press star"

// dialog: "thank you for calling, goodbye."

// if deleting messages:
// action: send digit "7" right after message starts
// dialog: "message erased, next message"
// dialog: "{message}"
// continue same flow as above

exports.accessVoicemail = async (number) => {
  const voice = new VoiceResponse();

  // initiate the call
  const call = await client.calls.create({
    url: `${config.base_url}/api/voice/initialCallHandler`,
    to: number,
    from: config.twilio.sender_id,
    statusCallback: `${config.base_url}/api/voice/statusCallBack`,
    statusCallbackMethod: 'POST'
  });

  // press pound key when call begins
  voice.play({
    digits: '#'
  });

  console.log(voice.toString());

  return Promise.resolve();
}

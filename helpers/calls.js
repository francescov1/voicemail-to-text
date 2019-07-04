'use strict';
const config = require('../config/index');
const client = require('../config/twilio');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

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

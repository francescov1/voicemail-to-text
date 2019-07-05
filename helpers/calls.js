'use strict';
const config = require('../config/index');
const client = require('../config/twilio');

exports.accessVoicemail = (number, message) => {
  // initiate the call
  return client.calls.create({
    url: `${config.base_url}/call/initialCallHandler?message=${message}&number=${number}`,
    to: '18776437786',
    from: config.twilio.sender_id,
    record: true,
    //machineDetection: "DetectMessageEnd",
    machineDetection: "Enable",
    machineDetectionSpeechEndThreshold: 5000,
    machineDetectionSpeechThreshold: 6000,
    machineDetectionSilenceTimeout: 10000
  });
}

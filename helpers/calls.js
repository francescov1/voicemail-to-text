'use strict';
const config = require('../config/index');
const client = require('../config/twilio');

exports.accessVoicemail = async (number, message) => {
  // initiate the call
  return await client.calls.create({
    url: `${config.base_url}/call/initialCallHandler?message=${message}&number=${number}`,
    to: number,
    from: config.twilio.sender_id
  });
}

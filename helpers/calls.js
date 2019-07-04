'use strict';
const config = require('../config/index');
const client = require('../config/twilio');

exports.accessVoicemail = async (number, action) => {
  // initiate the call
  const call = await client.calls.create({
    url: `${config.base_url}/call/initialCallHandler?action=${action}`,
    to: number,
    from: config.twilio.sender_id
  });

  return Promise.resolve();
}

'use strict';
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8080,
  node_env: process.env.NODE_ENV || 'development',
  base_url: process.env.BASE_URL,
  voice_password: process.env.VOICE_PASSWORD,
  rogers_provider_number: process.env.ROGERS_PROVIDER_NUMBER,
  personal_number: process.env.PERSONAL_NUMBER,
  twilio: {
    account_sid: process.env.TWILIO_ACCOUNT_SID,
    auth_token: process.env.TWILIO_AUTH_TOKEN,
    sender_id: process.env.TWILIO_SENDER_ID
  }
};

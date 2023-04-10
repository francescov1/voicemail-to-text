// @types packages are not working properly, probably some dumb config issue, not worth figuring out unless I continue building this project
const dotenv = require('dotenv');
dotenv.config();

export default {
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

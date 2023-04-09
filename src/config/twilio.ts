import config from './';
import twilio from 'twilio';
export default twilio(config.twilio.account_sid, config.twilio.auth_token);

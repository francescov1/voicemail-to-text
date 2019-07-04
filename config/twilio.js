'use strict';
const config = require('./');
module.exports = require('twilio')(config.twilio.account_sid, config.twilio.auth_token);

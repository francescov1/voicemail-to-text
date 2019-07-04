'use strict';

const config = require('./config');
const calls = require('./helpers/calls');

return calls.accessVoicemail("+14164535790")
  .catch(err => console.error(err));

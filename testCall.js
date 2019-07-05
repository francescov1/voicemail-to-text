'use strict';

const config = require('./config');
const calls = require('./helpers/calls');

return calls.accessVoicemail("14039928497", "read")
  .catch(err => console.error(err));

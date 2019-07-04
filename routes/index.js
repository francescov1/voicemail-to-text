'use strict';
const express = require('express');
const router = express.Router();

router.use('/sms', require('./sms'));

module.exports = router;

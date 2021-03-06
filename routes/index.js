'use strict';
const express = require('express');
const router = express.Router();

router.use('/sms', require('./sms'));
router.use('/call', require('./calls'));

module.exports = router;

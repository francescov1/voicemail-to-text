'use strict';
const express = require('express');
const router = express.Router();

router.post('/receive', (req, res, next) => {
  const number = req.body.From;
  const message = req.body.Body;

  // TODO: check whos number, may nee to adjust the speech to text based
  // on which service provider

  // for now assume its rogers
  console.log(req.body)

  return res.end();
});

module.exports = router;

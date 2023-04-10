import express from 'express'
import config from '../config'
import { initiateVoicemailCall } from '../helpers/calls'

const router = express.Router();

// TODO: Look at price for every execution, decide if its worth checking regularly, or just leave it up to user to initiate via sms

router.post('/getVoicemail', async (req, res, next) => {
  try {
    // remove '+' from number
    const number = req.body.From.slice(1);

    // TODO: To throw error, need to send an SMS message back to user.
    if (req.body.From !== config.personal_number) {
      throw new Error("Invalid sender")
    }

    const command = req.body.Body.toLowerCase().trim();

    if (!/^read$|^delete( [0-9]{1,2})+/.test(command)) {
      throw new Error("Invalid message format. Please use 'read' or 'delete {n1} {n2} ...'")
    }
    
    const message = command.split(' ');

    await initiateVoicemailCall(number, message);
    return res.end();
  }
  catch(err) {
    return next(err)
  }
});

export default router;

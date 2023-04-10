import express from 'express'
import smsRouter from './sms'
import callsRouter from './calls'

const router = express.Router();

router.use('/sms', smsRouter);
router.use('/call', callsRouter);

export default router;

import express from 'express'
const router = express.Router();

router.use('/sms', require('./sms'));
router.use('/call', require('./calls'));

export default router;

// otpRoutes.js
const express = require('express');
const router = express.Router();
const { sendOTP} = require('../controllers/otpsendController');
const {verifyOTP}=require('../controllers/otpverifyController')

router.post('/send', sendOTP);
router.post('/verify', verifyOTP);

module.exports = router;

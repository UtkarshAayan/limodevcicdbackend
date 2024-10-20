const express = require('express');
const { userSignup,driveSignup,login,registerAdmin, sendEmail, resetPassword,verifyOTP } = require('../controllers/authController')

//as User
const router = express.Router();

// for signup 
router.post('/userSignup', userSignup);
router.post('/driveSignup', driveSignup);


// router.post('/signup', signup);
router.post('/login', login);

//as Admin
router.post('/register-admin', registerAdmin);

//send reset emai
router.post('/send-email',sendEmail)

//Reset Password
router.post("/resetPassword", resetPassword);
router.post("/verifyOTP", verifyOTP);


module.exports = router;
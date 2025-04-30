import express from 'express';
import { register, sendOtp, verifyOtp, login, logout } from '../controllers/AuthController.js';

const router = express.Router();

router.post('/register', register);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/logout', logout);

export default router;
 
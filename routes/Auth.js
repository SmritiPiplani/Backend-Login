import express from 'express';
import { register, sendOtp, verifyOtp, login, logout } from '../controllers/AuthController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { protectedRoute } from '../controllers/AuthController.js';
const router = express.Router();

router.post('/register', register);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user', authMiddleware, authorizeRoles('user', 'admin'), protectedRoute);
router.get('/admin', authMiddleware, authorizeRoles('admin'), protectedRoute);
export default router;
 
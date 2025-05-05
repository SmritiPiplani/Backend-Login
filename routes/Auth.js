import express from 'express';
import { register, sendOtp, verifyOtp, login, logout ,getAllUsers} from '../controllers/AuthController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/logout', logout);

router.get('/users', authMiddleware, authorizeRoles('admin'), getAllUsers);

export default router;
 
import express from 'express';
import {getAllUsers,deleteUser,blockUser,unblockUser,
} from '../controllers/AuthController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware, authorizeRoles('admin')); // All routes below are admin protected

router.get('/users', getAllUsers);
router.delete('/users/:_id', deleteUser);
router.put('/users/block/:_id', blockUser);
router.put('/users/unblock/:_id', unblockUser);

export default router;

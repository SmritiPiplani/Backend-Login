import express from 'express';
import {deleteUser,updateUser} from '../controllers/AuthController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware, authorizeRoles('admin'));

// Admin routes
router.delete('/delete/:id', deleteUser);
router.put('/update/:id', updateUser);

export default router;

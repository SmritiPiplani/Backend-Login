import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { createBlog, getAllBlogs, updateBlog, deleteBlog } from '../controllers/BlogController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Public route - anyone can view
router.get('/', getAllBlogs);

// Admin-only routes
router.post('/', authMiddleware, authorizeRoles('admin'), upload.single('image'), createBlog);
router.put('/:id', authMiddleware, authorizeRoles('admin'), updateBlog);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), deleteBlog);


export default router;

import Blog from '../models/Blogs.js';
import logger from '../utils/logger.js';

import cloudinary from '../utils/cloudinary.js';
// Create Blog
export const createBlog = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can create blogs' });
    }

    const { title, content } = req.body;
    const imageUrls = req.files?.map(file => file.path) || [];

    const blog = new Blog({
      title,
      content,
      images: imageUrls,
      author: req.user.userId,
    });

    await blog.save();
    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (error) {
    logger.error('Blog creation failed', {
      message: error.message,
      stack: error.stack,
      route: req.originalUrl,
      body: req.body,
      user: req.user?.userId,
    });

    res.status(500).json({
      message: 'Something went wrong',
      error: error.message,
    });
  }
};


// Update Blog
export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Allow update only by admin or the author
    if (req.user.role !== 'admin' && blog.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    await blog.save();
    res.status(200).json({ message: 'Blog updated', blog });
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog', error });
  }
};

// Delete Blog
export const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (req.user.role !== 'admin' && blog.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await blog.deleteOne();
    res.status(200).json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error });
  }
};

// Get All Blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'email role').sort({ updatedAt: -1 });
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving blogs', error });
  }
};

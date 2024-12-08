import express from 'express';
import { createBlog, deleteBlog, updateBlog, getBlog, getBlogs, updateBlogLikes } from '../controllers/blog.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createBlog);
router.delete('/delete/:id', verifyToken, deleteBlog);
router.post('/update/:id', verifyToken, updateBlog);
router.post('/updateLike/:id', verifyToken, updateBlogLikes);
router.get('/get/:id', getBlog);
router.get('/get', getBlogs);

export default router;

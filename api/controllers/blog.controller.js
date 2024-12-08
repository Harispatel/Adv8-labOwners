import Blog from '../models/blog.model.js';
import { errorHandler } from '../utils/error.js';

export const createBlog = async (req, res, next) => {
  console.log("**********")
  console.log(req.body);
  console.log("**********")
  console.log(req.user);
  console.log("**********")
  if (req.user.role !== 1) {
    return next(errorHandler(401, 'Register as a lab owner to add a Blog!'));
  }

  try {
    const blog = await Blog.create(req.body);
    //console.log(blog.json)
    return res.status(201).json(blog);
  } catch (error) {
    next(error);
    console.log("**********")
    console.log(error);
    console.log("**********")
  }

};

export const deleteBlog = async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(errorHandler(404, 'Blog not found!'));
  }

  if (req.user.id !== blog.userRef) {
    return next(errorHandler(401, 'You can only delete your own Blogs!'));
  }

  try {
    await Blog.findByIdAndDelete(req.params.id); // Fix: Use the model here
    res.status(200).json('Blog has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(errorHandler(404, 'Blog not found!'));
  }
  if (req.user.id !== blog.userRef) {
    return next(errorHandler(401, 'You can only update your own Blogs!'));
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedBlog);
  } catch (error) {
    next(error);
  }
};

export const updateBlogLikes = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return next(errorHandler(404, 'Blog not found!'));
    }

    // Toggle likes using array of user IDs
    const action = req.body.action; // true or false
    const userId = req.user.id;


    if (action === true) {
      if (!blog.likes.includes(userId)) {
        blog.likes.push(userId);
      }
    } else if (action === false ) {
      blog.likes = blog.likes.filter(id => id !== userId);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      likes: blog.likes,
      likesCount: blog.likes.length
    });
  } catch (error) {
    console.error("Returned Error", error);
    next(error);
  }
};

export const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return next(errorHandler(404, 'Blog not found!'));
    }
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};

export const getBlogs = async (req, res, next) => {
  try {
    // Query Parameters
    const searchTerm = req.query.search || ''; // Search by title or content
    const limit = parseInt(req.query.limit) || 10; // Pagination limit (default: 10)
    const page = parseInt(req.query.page) || 1; // Pagination page (default: 1)

    // Build query to search title and content
    const query = {
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { content: { $regex: searchTerm, $options: 'i' } },
      ],
    };

    // Get total count for pagination
    const totalBlogs = await Blog.countDocuments(query);

    // Fetch blogs with pagination
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      total: totalBlogs,
      page,
      limit,
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

// export const getBlogs = async (req, res, next) => {
//   try {
//     // Query Parameters
//     const searchTerm = req.query.search || ''; // Search by title or content
//     const user = req.query.userRef || ''; // Filter by userRef (optional)
//     const limit = parseInt(req.query.limit) || 10; // Pagination limit (default: 10)
//     const page = parseInt(req.query.page) || 1; // Pagination page (default: 1)

//     // Build query
//     const query = {
//       $or: [
//         { title: { $regex: searchTerm, $options: 'i' } },
//         { content: { $regex: searchTerm, $options: 'i' } },
//       ],
//     };

//     if (user) {
//       query.userRef = user;
//     }

//     // Get total count for pagination
//     const totalBlogs = await Blog.countDocuments(query);

//     // Fetch blogs with pagination
//     const blogs = await Blog.find(query)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     res.status(200).json({
//       total: totalBlogs,
//       page,
//       limit,
//       blogs,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

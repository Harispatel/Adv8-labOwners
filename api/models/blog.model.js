import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    image: { 
      type: String, 
      required: true 
    },
    userRef: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
      required: false,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
const blogDB = require('../models/blogModel')
const asynchandler = require("express-async-handler")
const response = require("../middlewares/responseMiddleware")
const cloudinary = require("../utils/cloudinary");

const createBlog = asynchandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    response.validationError(res, "Please enter all datas to create a blog");
    return;
  }
  var imageUrl = '';
  if (req.file) {
    const uploadedImg = await cloudinary.uploader.upload(req.file.path, {
      folder: "Bharat One"
    })
    imageUrl = uploadedImg.secure_url;
  }
  const newBlog = new blogDB({
    title: title,
    content: content,
    image: imageUrl
  })
  const savedBlog = await newBlog.save();
  if (savedBlog) {
    response.successResponst(res, savedBlog, "saved blog successfully");
  }
  else {
    response.internalServerError(res, "Error in Creating the blog");
  }
})
const getAllBlogs = asynchandler(async (req, res) => {
  const blogs = await blogDB.find({});
  if (blogs) {
    response.successResponst(res, blogs, "Successfully fetched all the blogs")
  }
  else {
    response.internalServerError(res, "Failed to fetch all the blogs");
  }
})
const getParticularBlog = asynchandler(async (req, res) => {
  const id = req.params.id;
  const blog = await blogDB.findById({ _id: id });
  if (blog) {
    response.successResponst(res, blog, "Successfully fetched the blog");
  }
  else {
    response.notFoundError(res, "error in finding the blog");
  }
})
const updateBlog = asynchandler(async (req, res) => {
  const id = req.params.id;
  const blog = await blogDB.findById({ _id: id });
  if (blog) {
    const { title, content } = req.body;
    const updateOptions = {};
    if (title) {
      updateOptions.title = title
    }
    if (content) {
      updateOptions.content = content
    }

    if (req.file) {
      const uploadedImg = await cloudinary.uploader.upload(req.file.path, {
        folder: "Bharat One"
      })
      updateOptions.image = uploadedImg.secure_url;
    }
    const updatedBlog = await blogDB.findByIdAndUpdate({ _id: id }, updateOptions, { new: true });
    if (updatedBlog) {
      response.successResponst(res, updatedBlog, "Successfully Updated the blog");
    }
    else {
      response.internalServerError(res, "Failed to update the blog");
    }
  }
  else {
    response.notFoundError(res, "Error in finding the particular blog")
  }
})

const deleteBlog = asynchandler(async (req, res) => {
  const id = req.params.id;
  const blog = await blogDB.findById({ _id: id });
  if (blog) {
    const deletedBlog = await blogDB.findByIdAndDelete({ _id: id });
    if (deletedBlog) {
      response.successResponst(res, deletedBlog, "Successfully deleted the blog");
    }
    else {
      response.internalServerError(res, "Failed to update the blog");
    }
  }
  else {
    response.notFoundError(res, "error in finding the blog");
  }
})
module.exports = { createBlog,getAllBlogs,getParticularBlog,updateBlog,deleteBlog};  
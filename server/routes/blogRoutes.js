const { createBlog, getAllBlogs, updateBlog, getParticularBlog, deleteBlog } = require("../controllers/blogController");
const { checkAdmin } = require("../middlewares/authMiddleware");
const router = require("express").Router();
const upload=require("../utils/multer")



router.post("/createblog", checkAdmin,upload.single('image'), createBlog);
router.get("/getallblogs", getAllBlogs);
router.get("/getblog/:id", getParticularBlog);
router.put("/updateblog/:id", checkAdmin,upload.single('image'), updateBlog);
router.delete("/deleteblog/:id", checkAdmin, deleteBlog);

module.exports = router;
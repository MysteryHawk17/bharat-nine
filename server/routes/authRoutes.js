const { registerUser, loginUser } = require('../controllers/authController');

const router=require('express').Router();
const upload=require("../utils/multer")

router.post("/register",upload.single('image'),registerUser);
router.post("/login",loginUser);


module.exports=router;
const { registerUser, loginUser, forgotpassword, resetpassword } = require('../controllers/authController');

const router=require('express').Router();


router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/forgotpassword",forgotpassword) 
router.post("/resetpassword/:token",resetpassword);

module.exports=router;
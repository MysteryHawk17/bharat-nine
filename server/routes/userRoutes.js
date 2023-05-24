const { test, getAllUser, getUser, updateUser, deleteUser, resetPassword } = require("../controllers/userController");

const router = require("express").Router();
const { checkAdmin, checkLogin } = require('../middlewares/authMiddleware')


router.get("/test", test);
router.get("/getalluser", checkAdmin, getAllUser);
router.get("/getuser", checkLogin, getUser)
router.put("/updateuser", checkLogin, updateUser);
router.delete("/deleteuser", checkLogin, deleteUser);
router.put("/resetpassword",checkLogin,resetPassword);
module.exports = router;
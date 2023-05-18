const { test, getAllTemple, getSingleTemple, createTemple, deleteTemple } = require("../controllers/templeController");
const { checkAdmin } = require("../middlewares/authMiddleware");

const router=require("express").Router();


router.get("/test",test);
router.get("/getalltemple",checkAdmin,getAllTemple);
router.get("/gettemple/:id",checkAdmin,getSingleTemple);
router.post("/createtemple",checkAdmin,createTemple);
router.delete("/deletetemple/:id",checkAdmin,deleteTemple);

module.exports=router;
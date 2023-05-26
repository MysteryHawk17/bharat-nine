const { test, getAllTemple, getSingleTemple, createTemple, deleteTemple, updateTemple } = require("../controllers/templeController");
const { checkAdmin } = require("../middlewares/authMiddleware");

const router=require("express").Router();


router.get("/test",test);
router.get("/getalltemple",checkAdmin,getAllTemple);
router.get("/gettemple/:id",checkAdmin,getSingleTemple);
router.post("/createtemple",checkAdmin,createTemple);
router.delete("/deletetemple/:id",checkAdmin,deleteTemple);
router.put("/updatetemple/:id",checkAdmin,updateTemple);

module.exports=router;
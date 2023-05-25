const { test, createDarshan, getAllDarshan, getADarshan, updateDarshan, deleteDarshan } = require("../controllers/liveDarshanControllers");

const router=require("express").Router();
const {checkAdmin }=require("../middlewares/authMiddleware");

router.get("/test",test);
router.post("/createdarshan",checkAdmin,createDarshan);
router.get("/getalldarshan",getAllDarshan);
router.get("/getadarshan/:id",getADarshan);
router.put("/updatedarshan/:id",checkAdmin,updateDarshan);
router.delete("/deletedarshan/:id",checkAdmin,deleteDarshan);


module.exports=router
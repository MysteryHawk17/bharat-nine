const { test, createPuja, getLocationPuja, getbasedPuja, updatePuja, deletePuja } = require("../controllers/pujaController");
const{checkAdmin}=require("../middlewares/authMiddleware")
const router=require("express").Router();


router.get("/test",test);
router.post("/create",checkAdmin,createPuja)
router.get("/location/getpuja",getLocationPuja)
router.get("/based/getpuja",getbasedPuja);
router.put("/updatepuja/:id",checkAdmin,updatePuja);
router.delete("/deletepuja/:id",checkAdmin,deletePuja)
module.exports=router;
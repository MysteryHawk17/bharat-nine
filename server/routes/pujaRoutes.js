const { test, createPuja, getLocationPuja, getbasedPuja, updatePuja, deletePuja, getPuja, getAllPuja } = require("../controllers/pujaController");
const{checkAdmin}=require("../middlewares/authMiddleware")
const router=require("express").Router();
const upload=require("../utils/multer")

router.get("/test",test);
router.post("/create",checkAdmin,upload.single("image"),createPuja)
router.get('/getpuja/:id',getPuja);
router.get("/getallpuja",getAllPuja);
router.get("/location/getpuja",getLocationPuja)
router.get("/based/getpuja",getbasedPuja);
router.put("/updatepuja/:id",checkAdmin,upload.single("image"),updatePuja);
router.delete("/deletepuja/:id",checkAdmin,deletePuja)
module.exports=router;
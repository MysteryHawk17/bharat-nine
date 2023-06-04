const { test, createOnlinePuja, createOfflinePuja, createBothPuja, updatePuja, deletePuja, getAllPuja, getOnePuja, basedPuja } = require('../controllers/pujaController')

const router=require('express').Router()
const {checkAdmin}=require("../middlewares/authMiddleware")
const upload=require("../utils/multer");


router.get("/test",test);
router.post("/create/online",checkAdmin,upload.single("image"),createOnlinePuja);
router.post("/create/offline",checkAdmin,upload.single("image"),createOfflinePuja);
router.post("/create/both",checkAdmin,upload.single('image'),createBothPuja)
router.put("/updatepuja/:id",checkAdmin,upload.single('image'),updatePuja);
router.delete("/deletepuja/:id",checkAdmin,deletePuja);
router.get("/getallpuja",getAllPuja);
router.get("/getbasedpuja/:based",basedPuja)
router.get("/getpuja/:id",getOnePuja);


module.exports=router;
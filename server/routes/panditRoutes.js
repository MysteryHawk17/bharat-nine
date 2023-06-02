const { test, createPandit, updatePandit, deletePandit, getAllPandit, getAPandit, getlocationPandit, getPujaBasedPandit, availableTimings } = require("../controllers/panditController");

const router=require("express").Router();
const upload=require("../utils/multer");



router.get("/test",test);
router.post("/createpandit",upload.single('image'),createPandit);
router.put("/updatepandit/:id",upload.single('image'),updatePandit);
router.delete("/deletepandit/:id",deletePandit);
router.get("/getallpandit",getAllPandit);
router.get("/getpandit/:id",getAPandit);
router.get("/getlocationpandit",getlocationPandit);
router.get("/getpujapandit",getPujaBasedPandit);
router.get("/availablepandit",availableTimings);



module.exports=router;
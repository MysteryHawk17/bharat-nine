const { test, createOnlinePuja, createOfflinePuja, createBothPuja, updatePuja, deletePuja, getAllPuja, getOnePuja, basedPuja } = require('../controllers/pujaController')

const router = require('express').Router()
const { checkAdmin } = require("../middlewares/authMiddleware")
const upload = require("../utils/multer");


router.get("/test", test);
router.post("/create/online", checkAdmin, upload.array("images"), createOnlinePuja);
router.post("/create/offline", checkAdmin, upload.array("images"), createOfflinePuja);
router.post("/create/both", checkAdmin, upload.array("images"), createBothPuja)
router.put("/updatepuja/:id", checkAdmin, upload.array("images"), updatePuja);
router.delete("/deletepuja/:id", checkAdmin, deletePuja);
router.get("/getallpuja", getAllPuja);
router.get("/getbasedpuja/:based", basedPuja)
router.get("/getpuja/:id", getOnePuja);


module.exports = router;
const { test, getAllPandit, getlocationPandit, getPujaBasedPandit, deletePandit, updatePandit, createPandit, availablepandit } = require("../controllers/panditController")
const { checkAdmin } = require("../middlewares/authMiddleware")

const router = require("express").Router()
const upload = require('../utils/multer')
router.get("/test", test)
router.post('/createpandit', checkAdmin, upload.single("image"), createPandit)
router.get("/getallpandit", getAllPandit)
router.get("/getlocationpandit", getlocationPandit)
router.get("/getpujapandit", getPujaBasedPandit)
router.get("/availablepandit",availablepandit);
router.delete("/deletepandit/:id", checkAdmin, deletePandit);
router.put("/updatepandit/:id", checkAdmin, upload.single("image"), updatePandit);

module.exports = router;
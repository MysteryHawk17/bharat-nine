const { test, getAllPandit, getlocationPandit, getPujaBasedPandit, deletePandit, updatePandit, createPandit } = require("../controllers/panditController")

const router = require("express").Router()


router.get("/test", test)
router.post('/createpandit', createPandit)
router.get("/getallpandit", getAllPandit)
router.get("/getlocationpandit", getlocationPandit)
router.get("/getpujapandit", getPujaBasedPandit)
router.delete("/deletepandit/:id", deletePandit);
router.put("/updatepandit/:id", updatePandit);

module.exports = router;
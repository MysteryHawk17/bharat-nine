const { createPrasad, getAllPrasad, getPrasad, deletePrasad, updatePrasad } = require("../controllers/prasadController");
const { checkAdmin } = require("../middlewares/authMiddleware");
const router = require("express").Router();
const upload = require("../utils/multer")

router.post("/createprasad", checkAdmin, upload.array("images"), createPrasad);
router.get("/getallprasad", getAllPrasad);
router.get("/getprasad/:id", getPrasad);
router.delete("/deleteprasad/:id", checkAdmin, deletePrasad);
router.put("/updateprasad/:id", checkAdmin, upload.array("images"), updatePrasad);

module.exports = router;
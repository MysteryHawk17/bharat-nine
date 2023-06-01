const { createPrasad, getAllPrasad, getPrasad, deletePrasad, updatePrasad } = require("../controllers/prasadController");
const { checkAdmin } = require("../middlewares/authMiddleware");
const router = require("express").Router();
const upload = require("../utils/multer")


router.post("/createprasad", upload.single('image'), createPrasad);
// router.post("/createprasad",checkAdmin,upload.single('image'),createPrasad);
router.get("/getallprasad", getAllPrasad);
router.get("/getprasad/:id", getPrasad);
router.delete("/deleteprasad/:id", checkAdmin, deletePrasad);
router.put("/updateprasad/:id", upload.single('image'), updatePrasad);
// router.put("/updateprasad/:id",checkAdmin,upload.single('image'),updatePrasad);

module.exports = router;
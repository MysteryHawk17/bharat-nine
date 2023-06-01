const { addBanner, deleteBanner, getAllBanner, getBanner } = require("../controllers/bannerController");
const { checkAdmin } = require("../middlewares/authMiddleware");
const router = require("express").Router();
const upload = require("../utils/multer");



router.post("/create", checkAdmin, upload.single('image'), addBanner);
router.get("/getallbanner", getAllBanner);

router.delete("/getbanner/:id", getBanner);
router.delete("/delete/:id", checkAdmin, deleteBanner);


module.exports = router;
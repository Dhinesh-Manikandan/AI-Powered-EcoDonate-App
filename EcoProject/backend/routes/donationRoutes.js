const express = require("express");
const router = express.Router();
const { submitDonation, getUnclaimedDonations } = require("../controllers/donationController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");
const {searchDonations}=require("../controllers/donationSearch")
const {getUserDonations}=require("../controllers/authController")
const {getDonationById} =require("../controllers/claimController")
const {claimDonation}=require("../controllers/claimController")
const {claimedbyUser}=require("../controllers/claimedbyUser")

router.post("/", protect, upload.single("image"), submitDonation);
router.get("/", protect, getUnclaimedDonations); // For companies to view available waste
router.get("/search",searchDonations);
router.get("/:id/donations", protect, getUserDonations);
router.get("/:id",protect, getDonationById);
router.put("/:id/claim", protect, claimDonation);
router.get("/:id/claimed", protect, claimedbyUser);



module.exports = router;

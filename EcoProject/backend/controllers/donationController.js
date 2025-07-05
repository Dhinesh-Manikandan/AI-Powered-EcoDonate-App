const Donation = require("../models/Donation");
const axios = require("axios");
const path = require("path");

// 🔹 Utility: Convert string to Title Case
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

// 🔹 Utility: Capitalize first letter, rest lowercase
function formatSentence(str) {
  if (!str || typeof str !== "string") return str;
  str = str.trim();
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// 🔹 AI: Call Flask microservice for metadata
async function generateFromAI(imagePath) {
  try {
    const res = await axios.post("http://127.0.0.1:7000/generate", {
      imagePath,
    });
    return res.data;
  } catch (err) {
    console.error("⚠️ AI generation failed:", err.message);
    return {};
  }
}

// 🔹 Submit Donation Handler
const submitDonation = async (req, res) => {
  try {
    let {
      quantity,
      condition,
      expected,
      pickupLocation,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required." });
    }

    const imagePath = path.join(__dirname, "..", "uploads", req.file.filename);

    // 🧠 Get AI-generated fields
    const aiGenerated = await generateFromAI(imagePath);
    let {
      wasteName,
      description,
      wasteType,
      suitableFor
    } = aiGenerated;

    const validTypes = ["Plastic", "E-waste", "Cloth", "Glass", "Organic", "Other", "Unknown"];
    const validRecipients = ["Company", "Company or Public"];

    // 🧹 Format AI-generated & user-provided fields
    if (typeof wasteName === "string") wasteName = toTitleCase(wasteName);
    if (typeof description === "string") description = formatSentence(description);
    if (typeof pickupLocation === "string") pickupLocation = toTitleCase(pickupLocation);

    if (!validTypes.includes(wasteType)) wasteType = "Unknown";
    if (!validRecipients.includes(suitableFor)) suitableFor = "Company";

    const newDonation = new Donation({
      wasteName,
      wasteType,
      suitableFor,
      description,
      quantity,
      condition,
      expected,
      pickupLocation,
      image: req.file.filename,
      donor: req.user._id,
    });

    await newDonation.save();

    res.status(201).json({
      message: "✅ Donation submitted successfully",
      donation: newDonation,
    });
  } catch (err) {
    console.error("❌ Donation submission error:", err);
    res.status(500).json({ message: err.message || "Server error" }); // ✅ Detailed error response
  }
};

// 🔹 Get All Unclaimed Donations Suitable for Company
const getUnclaimedDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      claimedBy: null,
      suitableFor: "Company"
    }).populate("donor", "name");

    res.json(donations);
  } catch (err) {
    console.error("❌ Error fetching donations:", err);
    res.status(500).json({ message: err.message || "Failed to fetch donations" });
  }
};


module.exports = {
  submitDonation,
  getUnclaimedDonations,
};

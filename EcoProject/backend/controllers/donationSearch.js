const Donation = require("../models/Donation");

const searchDonations = async (req, res) => {
  try {
    const { name, type, condition, expected, location } = req.query;

    const query = {
      suitableFor: "Company or Public" // ✅ Only include publicly accessible donations
    };

    if (name) {
      query.wasteName = { $regex: name, $options: "i" };
    }

    if (location) {
      query.pickupLocation = { $regex: location, $options: "i" };
    }

    if (type) query.wasteType = type;
    if (condition) query.condition = condition;
    if (expected) query.expected = expected;
    query.claimedBy=null;
    const results = await Donation.find(query);

    res.json(results);
  } catch (error) {
    console.error("❌ Search error:", error);
    res.status(500).json({ message: "Search failed", error });
  }
};

module.exports = { searchDonations };

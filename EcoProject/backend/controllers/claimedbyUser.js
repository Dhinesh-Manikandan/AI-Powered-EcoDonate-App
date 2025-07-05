const Donation = require("../models/Donation");
const User = require("../models/User");

const claimedbyUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Populate both claimedBy and donor
    const donations = await Donation.find({ claimedBy: id })
      .populate("donor", "name email phone role")
      .populate("claimedBy", "role");

    return res.status(200).json(donations);
  } catch (err) {
    console.error("Error in claimedbyUser:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  claimedbyUser,
};

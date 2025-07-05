const Donation = require("../models/Donation");
const User = require("../models/User");

const getUserDonations = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let donations = [];

    if (user.role === "donor") {
      donations = await Donation.find({ donor: id }).populate("claimedBy", "name email  phone role");
    } else if (user.role === "org") {
      donations = await Donation.find({ claimedBy: id }).populate("donor", "name email phone role");
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    return res.status(200).json(donations);
  } catch (err) {
    console.error("Error in getUserDonations:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserDonations,
};

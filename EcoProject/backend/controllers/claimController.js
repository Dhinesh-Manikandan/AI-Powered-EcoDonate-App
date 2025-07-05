const Donation = require("../models/Donation");

exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate("donor", "name email phone")
      .populate("claimedBy", "name email phone");

    if (!donation) return res.status(404).json({ msg: "Donation not found" });

    res.json(donation);
  } catch (err) {
    console.error("Error in getDonationById:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.claimDonation = async (req, res) => {
  try {
    const { orgId } = req.body;
    const donation = await Donation.findById(req.params.id);

    if (!donation) return res.status(404).json({ msg: "Donation not found" });

    donation.claimedBy = orgId;
    await donation.save();

    res.json({ msg: "Donation claimed successfully" });
  } catch (err) {
    console.error("Error in claimDonation:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

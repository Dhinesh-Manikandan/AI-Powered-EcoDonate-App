const OTP = require("../models/OTP");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔹 Utility: Convert string to Title Case
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

// 🔹 Verify OTP and Register User (step 2)
exports.verifyOTP = async (req, res) => {
  let { phone, otp, name, email, password, role } = req.body;
  otp=otp.trim();
  // 🔸 Basic validation
  if (!otp ) {
      return res.status(400).json({ msg: "Enter you OTP" });
    }

  try {
    const existingOTP = await OTP.findOne({ phone });
    if (!existingOTP) {
      return res.status(400).json({ msg: "No OTP found for this number" });
    }

    if (existingOTP.expiresAt < new Date()) {
      await OTP.deleteOne({ phone });
      return res.status(400).json({ msg: "OTP has expired" });
    }

    if (existingOTP.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

  

    

    // 🔸 Format inputs
    const formattedName = toTitleCase(name);
    const formattedEmail = email.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: formattedName,
      email: formattedEmail,
      phone,
      password: hashedPassword,
      role,
      isPhoneVerified: true
    });

    await OTP.deleteOne({ phone });

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.status(201).json({
      msg: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        role: newUser.role,
        phone:newUser.phone,
        email:newUser.email
      }
    });

  } catch (err) {
    console.error("OTP verify error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

const OTP = require("../models/OTP");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Utility to generate a 6-digit random OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 🔹 Send OTP (step 1)
exports.sendOTP = async (req, res) => {
  const { phone,name, email, password, role } = req.body;

  if (!phone || !name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    // 🔸 Check if email/phone already exists
    const emailExists = await User.findOne({ email: email.trim().toLowerCase(),role:role});
    if (emailExists) {
      return res.status(400).json({ msg: "Email already in use for the same role" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }
  
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ msg: "Invalid phone number" });
    }
  
    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }


  try {
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await OTP.deleteMany({ phone }); // remove old OTPs
    await OTP.create({ phone, otp: otpCode, expiresAt });

    // Demo: log instead of sending SMS
    console.log(`📲 OTP for ${phone}: ${otpCode}`);

    res.json({ msg: "OTP sent successfully (console)" });
  } catch (err) {
    console.error("OTP send error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


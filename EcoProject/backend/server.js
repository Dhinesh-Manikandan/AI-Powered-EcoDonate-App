const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const donationRoutes = require("./routes/donationRoutes");
const otpRoutes = require('./routes/otpRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // ⬅️ Required to serve image files publicly

// ✅ API route
app.use('/api/auth', authRoutes);
app.use("/api/donations", donationRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/users',donationRoutes)

// ✅ Start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('❌ DB connection error:', err));

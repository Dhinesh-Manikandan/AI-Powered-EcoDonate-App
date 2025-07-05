import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'donor'
  });
  
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async () => {
    try {
     
        const { name, email, phone, password, role } = formData;

      await axios.post('http://localhost:5000/api/otp/send', {
        name,
        email,
        phone,
        password,
        role,
        
      });

      alert("📲 OTP sent to your server (Check terminal)");
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.msg || "❌ Failed to send OTP");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const { name, email, phone, password, role } = formData;
      if (!otp) return alert("⚠️ Please enter OTP");

      const res = await axios.post('http://localhost:5000/api/otp/verify', {
        name,
        email,
        phone,
        password,
        role,
        otp
      });

      alert("✅ Phone verified and user registered!");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate('/');
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.msg || "❌ OTP verification failed");
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>

      <input type="text" name="name" placeholder="Name" onChange={handleChange} className="input" />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} className="input" />
      <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} className="input" />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} className="input" />

      <select name="role" value={formData.role} onChange={handleChange} className="input">
        <option value="donor">Donor</option>
        <option value="org">Organization</option>
      </select>

      {!otpSent ? (
        <button className="btn-green" onClick={handleSendOTP}>Send OTP</button>
      ) : (
        <div className="otp-section">
          <input type="text" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} className="input" />
          <button className="btn-blue" onClick={handleVerifyOTP}>Verify & Register</button>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;

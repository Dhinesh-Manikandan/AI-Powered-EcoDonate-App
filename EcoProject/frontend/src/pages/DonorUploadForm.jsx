import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "../styles/DonorUploadForm.css";

const DonorUploadForm = () => {
  const [formData, setFormData] = useState({
    quantity: 1,
    condition: 'Used',
    expected: 'Free',
    pickupLocation: ''
  });
  
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png'];

    if (file && !allowedTypes.includes(file.type)) {
      alert("Only JPG or PNG images are allowed.");
      e.target.value = '';
      return;
    }

    setImageFile(file);
  };

  const handleSubmit = async () => {
    const { quantity, condition, expected, pickupLocation } = formData;

    if (!quantity || !condition || !expected || !pickupLocation) {
      alert("Please fill out all required fields.");
      return;
    }
    if(!imageFile){
      alert("Please Upload a image of the thing that you want you to donate");
      return;
    }

    const token = localStorage.getItem('token');
    const payload = new FormData();

    for (const key in formData) {
      payload.append(key, formData[key]);
    }

    payload.append('image', imageFile);

    try {
      const res = await axios.post('http://localhost:5000/api/donations', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert("🎉 Donation submitted successfully!");

      setFormData({
        quantity: 1,
        condition: 'Used',
        expected: 'Free',
        pickupLocation: ''
      });
      setImageFile(null);
      navigate('/account');
    } catch (err) {
      const message = err.response?.data?.message || "Submission failed. Please try again.";
      alert(`❌ Submission Failed: ${message}`);
    }
  };

  return (
    <div className="donor-form-container">
      <h2 className="donor-form-title">♻️ Donate Waste</h2>

      <input
        name="quantity"
        type="number"
        placeholder="Quantity"
        className="donor-input"
        onChange={handleChange}
        min={1}
        required
        value={formData.quantity}
      />

      <select
        name="condition"
        className="donor-input"
        onChange={handleChange}
        value={formData.condition}
        required
      >
        <option value="New">New</option>
        <option value="Used">Used</option>
        <option value="Damaged">Damaged</option>
      </select>

      <select
        name="expected"
        className="donor-input"
        onChange={handleChange}
        value={formData.expected}
        required
      >
        <option value="Free">Free</option>
        <option value="Small Fee">Small Fee</option>
      </select>

      <input
        type="file"
        accept="image/jpeg,image/png"
        className="donor-input"
        onChange={handleImageChange}
        required
      />

      <input
        name="pickupLocation"
        placeholder="Pickup Location"
        className="donor-input"
        onChange={handleChange}
        required
        value={formData.pickupLocation}
      />

      <button className="donor-submit-btn" onClick={handleSubmit}>
        Submit Donation
      </button>
    </div>
  );
};

export default DonorUploadForm;

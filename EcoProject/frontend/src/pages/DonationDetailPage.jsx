import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/DonationDetailPage.css";

const DonationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [user, setUser] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    axios.get(`http://localhost:5000/api/donations/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => setDonation(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleConfirm = () => {
    axios.put(`http://localhost:5000/api/donations/${id}/claim`, {
      orgId: user.id
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(() => {
        alert("🎉 Donation successfully claimed!");
        navigate("/account");
      })
      .catch(() => alert("❌ Error claiming donation"));
  };

  if (!donation) return <p className="loading-text">Loading...</p>;

  return (
    <div className="donation-detail-container">
      <h2 className="donation-title">{donation.wasteName}</h2>
      <img
        src={`http://localhost:5000/uploads/${donation.image}`}
        alt={donation.wasteName}
        className="donation-image"
      />
      <div className="donation-info">
        <p><strong>Description:</strong> {donation.description}</p>
        <p><strong>Quantity:</strong> {donation.quantity}</p>
        <p><strong>Condition:</strong> {donation.condition}</p>
        <p><strong>Expected:</strong> {donation.expected}</p>
        <p><strong>Location:</strong> {donation.pickupLocation}</p>
        <p><strong>Donor Name:</strong> {donation?.donor?.name}</p>
        <p><strong>Email:</strong> {donation?.donor?.email}</p>
        <p><strong>Phone:</strong> {donation?.donor?.phone}</p>

      </div>

      {!donation.claimedBy ? (
        <button className="claim-btn" onClick={handleConfirm}>✅ Confirm Claim</button>
      ) : (
        <p className="claimed-text">✅ Already Claimed</p>
      )}
    </div>
  );
};

export default DonationDetailPage;

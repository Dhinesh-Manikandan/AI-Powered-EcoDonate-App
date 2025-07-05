import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ClaimedInfoPage.css'; // ✅ Import CSS

const ClaimedInfoPage = () => {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/donations/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => setDonation(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!donation) return <p className="loading-text">Loading...</p>;

  return (
    <div className="claimed-info-container">
      <h2 className="page-title">Donation: {donation.wasteName}</h2>

      {donation.image && (
        <img
          src={`http://localhost:5000/uploads/${donation.image}`}
          alt={donation.wasteName}
          className="donation-image"
        />
      )}

      <div className="donation-details">
        <p><strong>Description:</strong> {donation.description}</p>
        <p><strong>Quantity:</strong> {donation.quantity}</p>
        <p><strong>Condition:</strong> {donation.condition}</p>
        <p><strong>Expected:</strong> {donation.expected}</p>
        <p><strong>Location:</strong> {donation.pickupLocation}</p>
      </div>

      <div className="claimer-section">
        <h3 className="claimer-title">Claimed By</h3>
        {donation.claimedBy ? (
          <>
            <p><strong>Name:</strong> {donation.claimedBy.name}</p>
            <p><strong>Email:</strong> {donation.claimedBy.email}</p>
            <p><strong>Phone:</strong> {donation.claimedBy.phone || 'N/A'}</p>
          </>
        ) : (
          <p className="not-claimed">This donation has not been claimed yet.</p>
        )}
      </div>
    </div>
  );
};

export default ClaimedInfoPage;

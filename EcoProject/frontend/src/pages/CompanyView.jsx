import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CompanyView.css';

const CompanyView = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!token || user?.role !== 'org') {
      alert('Please login/register as a company.');
      navigate('/login');
      return;
    }

    axios.get('http://localhost:5000/api/donations', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setItems(res.data))
      .catch(err => alert(err.response?.data?.message || err.message));
  }, [token, user?.role, navigate]);

  const handleClaimView = (id) => {
    navigate(`/donation/${id}`);
  };

  return (
    <div className="company-view-container">

      {items.length === 0 ? (
        <p className="empty-text">No donations available right now.</p>
      ) : (
        <div className="donation-grid">
          {items.map(item => (
            <div key={item._id} className="donation-card">
              {item.image && (
                <img
                  src={`http://localhost:5000/uploads/${item.image}`}
                  alt={item.wasteName}
                  className="donation-image"
                />
              )}
              <h3 className="donation-title">{item.wasteName}</h3>
              <p><strong>Type:</strong> {item.wasteType}</p>
              <p><strong>Condition:</strong> {item.condition}</p>
              <p><strong>Expected:</strong> {item.expected}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Location:</strong> {item.pickupLocation}</p>

              {item.claimedBy ? (
                <p className="claimed-text">✅ Already Claimed</p>
              ) : (
                <button
                  onClick={() => handleClaimView(item._id)}
                  className="claim-btn"
                >
                  Claim
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyView;

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/AccountPage.css';

const AccountPage = () => {
  const [user, setUser] = useState({});
  const [donatedByMe, setDonatedByMe] = useState([]);
  const [claimedByMe, setClaimedByMe] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    setUser(parsed);

    const token = localStorage.getItem("token");

    axios.get(`http://localhost:5000/api/users/${parsed.id}/donations`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setDonatedByMe(res.data))
      .catch(err => console.error("Error fetching donated:", err));

    axios.get(`http://localhost:5000/api/donations/${parsed.id}/claimed`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setClaimedByMe(res.data))
      .catch(err => console.error("Error fetching claimed:", err));
  }, []);

  return (
  <div className="account-page-container">
    <h2 className="account-title">👤 Account - {user?.role?.toUpperCase()}</h2>

    <div className="user-info-top">
      <h3 className="info-title">📇 User Details</h3>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>

    {(user.role === "public" || user.role === "donor") && (
      <>
        <h3 className="section-title">🧾 Your Donations</h3>
        <div className="donation-grid">
          {donatedByMe.length > 0 ? donatedByMe.map((d) => (
            <div key={d._id} className="donation-card">
              {d.image && (
                <img
                  src={`http://localhost:5000/uploads/${d.image}`}
                  alt={d.wasteName}
                  className="donation-image"
                />
              )}
              <h4>{d.wasteName}</h4>
              <p>{d.description}</p>
              {d.claimedBy ? (
                <>
                 <p className="claimed-status">
                      ✅ Claimed by {d.claimedBy?.role === "org" ? "a Company" : "a Public User"}
                  </p>

                  <button onClick={() => navigate(`/claimed/${d._id}`)}>
                    View Claimed Info
                  </button>
                </>
              ) : (
                <p className="unclaimed-status">❌ Not yet claimed</p>
              )}
            </div>
          )) : (
            <p className="empty-msg">You haven’t made any donations yet.</p>
          )}
        </div>

        <h3 className="section-title">📥 Donations You've Claimed</h3>
        <div className="donation-grid">
          {claimedByMe.length > 0 ? claimedByMe.map((d) => (
            <div key={d._id} className="donation-card">
              {d.image && (
                <img
                  src={`http://localhost:5000/uploads/${d.image}`}
                  alt={d.wasteName}
                  className="donation-image"
                />
              )}
              <h4>{d.wasteName}</h4>
              <p>{d.description}</p>
              <p><strong>Donated By:</strong> {d.donor?.name || "Unknown"}</p>
              <p><strong>Email:</strong> {d.donor?.email || "N/A"}</p>
              <p><strong>Phone:</strong> {d.donor?.phone || "N/A"}</p>
            </div>
          )) : (
            <p className="empty-msg">You haven’t claimed any donations yet.</p>
          )}
        </div>
      </>
    )}

    {user.role === "org" && (
      <>
        <h3 className="section-title">📦 Claimed Donations</h3>
        <div className="donation-grid">
          {donatedByMe.length > 0 ? donatedByMe.map((d) => (
            <div key={d._id} className="donation-card">
              {d.image && (
                <img
                  src={`http://localhost:5000/uploads/${d.image}`}
                  alt={d.wasteName}
                  className="donation-image"
                />
              )}
              <h4>{d.wasteName}</h4>
              <p>{d.description}</p>
              <p><strong>Donated By:</strong> {d.donor?.name || "Unknown"}</p>
              <p><strong>Email:</strong> {d.donor?.email || "N/A"}</p>
              <p><strong>Phone:</strong> {d.donor?.phone || "N/A"}</p>
            </div>
          )) : (
            <p className="empty-msg">You haven’t claimed any donations yet.</p>
          )}
        </div>
      </>
    )}
  </div>
);


};

export default AccountPage;

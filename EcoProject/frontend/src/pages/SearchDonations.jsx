import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/SearchDonations.css"; // import the external CSS

const SearchDonations = () => {
  const [filters, setFilters] = useState({
    name: '',
    type: '',
    condition: '',
    expected: '',
    location: ''
  });

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();
  const wasteTypes = ['Plastic', 'E-waste', 'Cloth', 'Glass', 'Organic', 'Other'];

  useEffect(() => {
    fetchDonations({});
  }, []);

  const fetchDonations = async (filterParams) => {
    try {
      const query = new URLSearchParams(filterParams).toString();
      const res = await axios.get(`http://localhost:5000/api/donations/search?${query}`);
      if (Array.isArray(res.data)) {
        setResults(res.data);
        setMessage('');
      } else {
        setResults([]);
        setMessage('Unexpected data format from server.');
      }
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
      setMessage(err.response?.data?.msg || 'Search failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    const updatedFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(updatedFilters);
    fetchDonations(updatedFilters);
  };

  const handleAddToCart = (item) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login or register first to add to cart.");
      navigate("/login");
      return;
    }

    const updated = [...cart.filter(i => i._id !== item._id), item];
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    alert("✅ Added to cart!");
  };

  return (
    <div className="search-page">
      <h2 className="search-title">🔍 Search Donations</h2>

      <div className="filters">
        <input name="name" placeholder="Search by name..." onChange={handleChange} />
        <select name="type" onChange={handleChange}>
          <option value="">All Types</option>
          {wasteTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
        <select name="condition" onChange={handleChange}>
          <option value="">Any Condition</option>
          <option value="Used">Used</option>
          <option value="New">New</option>
        </select>
        <select name="expected" onChange={handleChange}>
          <option value="">Free or Paid</option>
          <option value="Free">Free</option>
          <option value="Paid">Paid</option>
        </select>
        <input name="location" placeholder="Search by location..." onChange={handleChange} />
      </div>

      {message && <p className="error-message">{message}</p>}

      <div className="results">
        {results.length > 0 ? (
          results.map(donation => (
            <div key={donation._id} className="donation-card">
              {donation.image && (
                <img src={`http://localhost:5000/uploads/${donation.image}`} alt={donation.wasteName} />
              )}
              <h3>{donation.wasteName}</h3>
              <p><strong>Type:</strong> {donation.wasteType}</p>
              <p><strong>Condition:</strong> {donation.condition}</p>
              <p><strong>Expected:</strong> {donation.expected}</p>
              <p><strong>Quantity:</strong> {donation.quantity}</p>
              <p><strong>Description:</strong> {donation.description}</p>
              <p><strong>Location:</strong> {donation.pickupLocation}</p>
              <button onClick={() => handleAddToCart(donation)}>🛒 Add to Cart</button>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>

      {cart.length > 0 && (
        <button className="view-cart-btn" onClick={() => navigate("/cart")}>
          🛒 View Cart ({cart.length})
        </button>
      )}
    </div>
  );
};

export default SearchDonations;

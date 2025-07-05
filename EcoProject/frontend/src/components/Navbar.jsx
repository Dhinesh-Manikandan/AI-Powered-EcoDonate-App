import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Navbar.css'; // ✅ Make sure this is present

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenData = localStorage.getItem("user");
    if (tokenData) {
      setUser(JSON.parse(tokenData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-logo">♻️ AI powered EcoDonate</h1>
      <div className="navbar-links">

        <Link to="/" className="nav-link">Home</Link>

        {!user && (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}

        {user?.role === "donor" && (
          <>
            <Link to="/donate" className="nav-link">Donate</Link>
            <Link to="/account" className="nav-link">Account</Link>
          </>
        )}

        {user?.role === "org" && (
          <>
            <Link to="/company" className="nav-link">Claim</Link>
            <Link to="/account" className="nav-link">Account</Link>
          </>
        )}

        {user && (
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('✅ Login successful');
      navigate('/');
      window.location.reload();

    } catch (err) {
      const msg = err.response?.data?.msg || 'Login failed';
      alert(msg);
      if (msg.toLowerCase().includes('not found')) {
        navigate('/register');
      }
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="login-input"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="login-input"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button className="login-btn" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;

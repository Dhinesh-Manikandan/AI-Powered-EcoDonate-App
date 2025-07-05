import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; 

// Components & Pages
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DonorUploadForm from './pages/DonorUploadForm';
import CompanyView from './pages/CompanyView';
import SearchDonations from './pages/SearchDonations';
import CartPage from './pages/CartPage';
import AccountPage from './components/AccountPage';
import DonationDetailPage from "./pages/DonationDetailPage";
import ClaimedInfoPage from "./pages/ClaimedInfoPage";

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <Routes>
          <Route path="/" element={<SearchDonations />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/donate" element={<DonorUploadForm />} />
          <Route path="/company" element={<CompanyView />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/donation/:id" element={<DonationDetailPage />} />
          <Route path="/claimed/:id" element={<ClaimedInfoPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

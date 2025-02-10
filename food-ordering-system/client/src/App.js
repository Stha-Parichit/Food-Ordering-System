import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import FilterPage from './components/FilterPage';
import Sidebar from './components/Sidebar';
import ResetPassword from './components/ResetPassword';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import OrderTracking from './components/OrderTracking';
import UploadFood from './components/UploadFood';
import AdminDashboard from './components/AdminDashboard';
import UserManagement from './components/UserManagement';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentFailed from './components/PaymentFailed';
import UserHome from './components/UserHome';

const App = () => (
  <Router>
    <Routes>
      {/* Set the root ("/") path to show the LandingPage */}
      <Route path="/" element={<LandingPage />} />

      {/* Define the home route */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/user-home" element={<UserHome />} />

      <Route path="/filter" element={<FilterPage />} />
      <Route path="/sidebar" element={<Sidebar />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-confirm" element={<OrderConfirmation />} />
      <Route path="/track" element={<OrderTracking />} />

      {/* Define the register and login routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/upload-item" element={<UploadFood />} />

      {/* Define the payment page routes */}
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-failed" element={<PaymentFailed />} />

      {/* Define the admin page routes */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/manage-user" element={<UserManagement />} />
    </Routes>
  </Router>
);

export default App;

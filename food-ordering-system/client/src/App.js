import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import OrderTracking from './components/OrderTracking';
import UploadFood from './components/UploadFood';
import AdminDashboard from './components/AdminDashboard';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentFailed from './components/PaymentFailed';
import FirstFruit from './components/FirstFruit';
import RegisteredUser from './components/RegisteredUsers';
import CategoriesPage from './components/CategoriesPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import PaymentPage from './components/PaymentPage';
import OrderConfirmation from './components/OrderConfirmation';
import ChefOrders from './components/ChefOrders'; // Import the new component
import OrderDetails from './components/OrderDetails'; // Import the new component
import EsewaPayment from './components/EsewaPayment';
import PaymentStatus from './components/PaymentStatus';
import OrderEdit from './components/CustomizeOrderPopup';

const App = () => (
  <GoogleOAuthProvider clientId="997514767176-rvk4v4cho4qvibhti41b08ser7afsm7t.apps.googleusercontent.com">
    <Router>
      <Routes>
        {/* Set the root ("/") path to show the LandingPage */}
        <Route path="/" element={<LandingPage />} />

        {/* Define the home route */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/filter" element={<FilterPage />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/track" element={<OrderTracking />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} /> {/* Add the new route */}
        <Route path="/chef-orders" element={<ChefOrders />} /> {/* Add the new route */}
        <Route path="/order-details/:orderId" element={<OrderDetails />} /> {/* Add the new route */}

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
        <Route path="/registered-user" element={<RegisteredUser />} />
        
        <Route path="/e-pay" element={<EsewaPayment />} />
        <Route path="/success" element={<PaymentStatus />} />
        <Route path="/failure" element={<PaymentStatus />} />
      </Routes>
    </Router>
  </GoogleOAuthProvider>
);

export default App;

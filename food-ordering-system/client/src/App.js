import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import LandingPage from './components/LandingPage';
// import HomePage from './components/HomePage';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import FilterPage from './components/FilterPage';
import Sidebar from './components/Sidebar';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderTracking from './components/OrderTracking';
import CategoriesPage from './components/CategoriesPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import PaymentPage from './components/PaymentPage';
import OrderConfirmation from './components/OrderConfirmation';
import ChefOrders from './components/ChefOrders';
import OrderDetails from './components/OrderDetails';
import EsewaPayment from './components/EsewaPayment';
import PaymentStatus from './components/PaymentStatus';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentFailed from './components/PaymentFailed';
import Register from './components/Register';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import UploadFood from './components/UploadFood';
import AdminDashboard from './components/AdminDashboard';
import RegisteredUser from './components/RegisteredUsers';
import FoodItemDetails from './components/FoodItemDetails';
import Orders from './pages/Orders';

const theme = createTheme(); // Ensure a theme is provided

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <GoogleOAuthProvider clientId="997514767176-rvk4v4cho4qvibhti41b08ser7afsm7t.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* <Route path="/home" element={<HomePage />} /> */}
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/filter" element={<FilterPage />} />
          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/track" element={<OrderTracking />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/chef-orders" element={<ChefOrders />} />
          <Route path="/order-details/:orderId" element={<OrderDetails />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/upload-item" element={<UploadFood />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/registered-user" element={<RegisteredUser />} />
          <Route path="/e-pay" element={<EsewaPayment />} />
          <Route path="/success" element={<PaymentStatus />} />
          <Route path="/failure" element={<PaymentStatus />} />
          <Route path="/food/:id" element={<FoodItemDetails />} />
          <Route path="/orders" element={<Orders />} />
          </Routes>
      </Router>
    </GoogleOAuthProvider>
  </ThemeProvider>
);

export default App;
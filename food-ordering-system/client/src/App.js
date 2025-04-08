import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import AdminOrders from './pages/AdminOrders';
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
import ViewTutorials from './pages/ViewTutorials';
import Orders from './pages/Orders';
import AllUsers from "./components/AllUsers";
import { logout } from './utils/auth';
import ChefPage from './components/ChefPage';
import ChefDashboard from './components/ChefDashboard';
import TutorialUpload from './components/TutorialUpload';
import TutorialDetail from './components/TutorialDetail';
import AddressesPage from './components/AddressesPage';
const theme = createTheme(); // Ensure a theme is provided

const PageTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const pageTitles = {
      '/': 'Landing Page',
      '/home': 'Home',
      '/dashboard': 'Dashboard',
      '/profile': 'Profile',
      '/filter': 'Filter',
      '/categories': 'Categories',
      '/orders': 'Orders',
      '/cart': 'Cart',
      '/checkout': 'Checkout',
      '/payment': 'Payment',
      '/track': 'Order Tracking',
      '/upload-item': 'Upload Food',
      '/admin-dashboard': 'Admin Dashboard',
      '/register': 'Register',
      '/login': 'Login',
      '/forgot-password': 'Forgot Password',
      '/reset-password': 'Reset Password',
      '/view-tutorials': 'View Tutorials',
      '/order-confirmation': 'Order Confirmation',
      '/chef-orders': 'Chef Orders',
      '/admin-orders': 'Admin Orders',
      '/payment-success': 'Payment Success',
      '/payment-failed': 'Payment Failed',
      '/order-details': 'Order Details',
      '/food': 'Food Item Details',
      '/registered-user': 'Registered Users',
      '/users-list': 'All Users',
      '/e-pay': 'Esewa Payment',
      '/success': 'Payment Success',
      '/failure': 'Payment Failed',
      '/chef': 'Chef Page',
      '/chef-dashboard': 'Chef Dashboard',
      '/tutorial-upload': 'Tutorial Upload Page',
      '/addresses': 'Addresses Page',
    };
    const pageTitle = pageTitles[location.pathname] || 'Page';
    document.title = `${pageTitle} - YOO!!!`;
  }, [location]);

  return null;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GoogleOAuthProvider clientId="997514767176-rvk4v4cho4qvibhti41b08ser7afsm7t.apps.googleusercontent.com">
        <Router>
          <PageTitleUpdater />
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
            <Route path="/admin-orders" element={<AdminOrders />} />
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
            <Route path="/tutorial-upload" element={<TutorialUpload />} />
            <Route path="/tutorial/:id" element={<TutorialDetail />} />
            <Route path="/view-tutorials" element={<ViewTutorials />} />    
            <Route path="/orders" element={<Orders />} />      
            <Route path="/users-list" element={<AllUsers />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/chef" element={<ChefPage />} />
            <Route path="/chef-dashboard" element={<ChefDashboard />} />
            <Route path="/addresses" element={<AddressesPage />} />
          </Routes>
          {/* Example usage of logout */}
          {/* <button onClick={logout}>Logout</button> */}
        </Router>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
};

export default App;
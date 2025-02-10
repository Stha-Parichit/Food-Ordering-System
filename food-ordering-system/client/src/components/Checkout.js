import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import "./Checkout.css";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Standard');
  const navigate = useNavigate();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const userEmail = localStorage.getItem("userEmail");
    const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "";
  
    useEffect(() => {
              document.title = "Admin Dashboard";
              const link = document.querySelector("link[rel*='icon']");
              link.href = "./images/logo.png";
          }, []);
    // Profile Dropdown Handlers
      const handleMouseEnter = () => setIsDropdownVisible(true);
      const handleMouseLeave = () => setIsDropdownVisible(false);
    
      const handleLogout = () => {
          localStorage.removeItem("token");
          localStorage.removeItem("userEmail");
          navigate("/login");  // Use navigate instead of window.location.href
        };
    
      useEffect(() => {
        const handleClickOutside = (e) => {
          const profileDropdown = document.querySelector(".profile-dropdown");
          const profileIcon = document.querySelector(".profile-icon-container");
          if (
            profileDropdown &&
            !profileDropdown.contains(e.target) &&
            !profileIcon.contains(e.target)
          ) {
            setIsDropdownVisible(false);
          }
        };
    
        document.addEventListener("click", handleClickOutside);
        return () => {
          document.removeEventListener("click", handleClickOutside);
        };
      }, []);

  // Get cart data from localStorage when the component mounts
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);

    const savedDiscount = JSON.parse(localStorage.getItem("selectedDiscount"));
    const savedCharity = JSON.parse(localStorage.getItem("selectedCharity"));

    if (savedDiscount) setSelectedDiscount(savedDiscount);
    if (savedCharity) setSelectedCharity(savedCharity);
  }, []);

  // Save discount and charity to localStorage
  const handleDiscountChange = (discount) => {
    setSelectedDiscount(discount);
    localStorage.setItem("selectedDiscount", JSON.stringify(discount)); // Save to localStorage
  };

  const handleCharityChange = (charity) => {
    setSelectedCharity(charity);
    localStorage.setItem("selectedCharity", JSON.stringify(charity)); // Save to localStorage
  };

  const handleBackClick = () => {
    navigate('/cart');
  }

  // Calculate the total price
  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const discounts = [
    { id: 1, title: '5% discount', amount: '5 stamps' },
    { id: 2, title: '7% discount', amount: '8 stamps' },
    { id: 3, title: '8% discount', amount: '10 stamps' },
    { id: 4, title: '10% discount', amount: '12 stamps' },
    { id: 5, title: '15% discount', amount: '15 stamps' }
  ];

  const charityOptions = [
    { id: 1, title: 'Local food bank', amount: 'Rs. 500' },
    { id: 2, title: 'Hunger relief', amount: 'Rs. 1000' },
    { id: 3, title: 'Community Meals', amount: 'Rs. 1500' },
    { id: 4, title: 'Hunger relief', amount: 'Rs. 2000' }
  ];

  // Calculate subtotal
  const subtotal = getTotal();
  const deliveryFee = 60;
  const charityDonation = selectedCharity ? parseInt(selectedCharity.amount.replace('Rs. ', '')) : 0;
  const discountAmount = selectedDiscount ? (subtotal * parseInt(selectedDiscount.title) / 100) : 0;
  const total = subtotal + deliveryFee + charityDonation - discountAmount;

  const handleCheckout = () => {
    // Save delivery address and other details to localStorage if needed
    localStorage.setItem("deliveryAddress", deliveryAddress);
    navigate('/order-confirm');
  };

  return (
    <div className="checkout-container">
      <header className="home-header">
              <div className="home-logo">
                <img src="/images/logo.png" alt="Logo" />
                  <span>YOO!!!</span>
              </div>
              <nav className="home-nav-links">
                <a href="/home">Home</a>
                <a href="/categories">Categories</a>
                <a href="/dashboard">Dashboard</a>
                <div className="user-search-bar">
                  <input type="text" placeholder="Search" />
                  <button>🔍</button>
                </div>
              </nav>
              <div className="header-right">
                <FaBell className="notification-icon" />
                <div
                  className="profile-icon-container"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => setIsDropdownVisible(!isDropdownVisible)}
                >
                  <span className="profile-icon">{firstLetter}</span>
                    {isDropdownVisible && (
                    <div className="profile-dropdown">
                      <p>{userEmail}</p>
                      <a href="/profile">View Profile</a>
                      <button onClick={handleLogout}>Logout</button>
                    </div>
                    )}
                </div>
              </div>
            </header>
      <div className="back-arrow" onClick={handleBackClick}>← BACK</div>

      <div className="checkout-card">
        <div className="section">
          <h2>🛒 Your Order</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty!</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="order-item">
                <span>{item.name} x{item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))
          )}
        </div>

        <div className="section">
          <h2>📍 Delivery</h2>
          <input
            type="text"
            placeholder="Delivery address..."
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="address-input"
          />
        </div>

        <div className="section">
          <div className="discount-options">
            {discounts.map(discount => (
              <button
                key={discount.id}
                className={`discount-btn ${selectedDiscount?.id === discount.id ? 'selected' : ''}`}
                onClick={() => handleDiscountChange(discount)}
              >
                {discount.title}
                <small>{discount.amount}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>💝 Charity donation</h2>
          <div className="charity-options">
            {charityOptions.map(charity => (
              <button
                key={charity.id}
                className={`charity-btn ${selectedCharity?.id === charity.id ? 'selected' : ''}`}
                onClick={() => handleCharityChange(charity)}
              >
                {charity.title}
                <small>{charity.amount}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>💳 Payment method</h2>
          <div className="payment-options">
            <button 
              className={`payment-btn ${paymentMethod === 'Standard' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('Standard')}
            >
              Standard
            </button>
            <button 
              className={`payment-btn ${paymentMethod === 'COD' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('COD')}
            >
              Cash On Delivery
            </button>
          </div>
        </div>

        <div className="order-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>Rs. {subtotal}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee:</span>
            <span>Rs. {deliveryFee}</span>
          </div>
          <div className="summary-row">
            <span>Charity Donation:</span>
            <span>Rs. {charityDonation}</span>
          </div>
          <div className="summary-row">
            <span>Loyalty Reward Discount:</span>
            <span>-Rs. {discountAmount}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>Rs. {total}</span>
          </div>
        </div>

        <button className="complete-payment-btn" onClick={handleCheckout}>
          Complete payment
        </button>
      </div>
      {/* Footer Section */}
      <footer className="home-footer">
        <p>© RecipeShare All Rights Reserved</p>
        <p>🍴 YOO!!!</p>
        <p>
          Disclaimer: This site is only for ordering and learning to cook food.
        </p>
      </footer>
    </div>
  );
};

export default Checkout;

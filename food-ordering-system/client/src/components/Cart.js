import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { FaBell } from "react-icons/fa";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
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
  }, []);

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
    setCartItems(updatedCart); // Update the cart state
  };

  // Update item quantity in cart
  const updateQuantity = (itemId, amount) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        item.quantity = Math.max(1, item.quantity + amount); // Ensure quantity is at least 1
      }
      return item;
    });
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
    setCartItems(updatedCart); // Update the cart state
  };

  // Calculate the total price
  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Proceed to checkout
  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
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
      
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>Your cart is empty!</p>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image_url} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>Rs. {item.price}</p>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="remove-item-button">Remove</button>
              </div>
              <div className="item-total">Rs. {item.price * item.quantity}</div>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="order-summary">
          <div className="total-price">Total: Rs. {getTotal()}</div>
          <button onClick={handleCheckout} className="checkout-button">
            Proceed to Checkout
          </button>
        </div>
      )}
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

export default Cart;

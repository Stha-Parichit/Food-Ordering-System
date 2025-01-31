import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

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
    </div>
  );
};

export default Cart;

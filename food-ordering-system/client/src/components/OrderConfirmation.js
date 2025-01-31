import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const [orderDetails, setOrderDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Get data from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const selectedDiscount = JSON.parse(localStorage.getItem("selectedDiscount"));
    const selectedCharity = JSON.parse(localStorage.getItem("selectedCharity"));

    // Calculate the total from cart items
    const subtotal = savedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const charityDonation = selectedCharity ? parseInt(selectedCharity.amount.replace('Rs. ', '')) : 0;
    const loyaltyDiscount = selectedDiscount ? (subtotal * parseInt(selectedDiscount.title) / 100) : 0;
    const deliveryFee = 60; 
    const total = subtotal + deliveryFee + charityDonation - loyaltyDiscount;

    // Set order details
    setOrderDetails({
      items: savedCart,
      charityDonation,
      loyaltyDiscount,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress: '123 Main St. Anytown, USA',  // You can retrieve from form input or localStorage
      estimatedDelivery: '30-45 minutes',
      deliveryMethod: 'Standard Delivery',
      paymentMethod: 'E-sewa P*************11'
    });
  }, []);

  const handleClick = () => {
    // Save the order details to localStorage
    localStorage.setItem("orderDetails", JSON.stringify(orderDetails));

    // Navigate to OrderTracking page
    navigate('/track');
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <h1 className="confirmation-title">Confirm Your Order</h1>

        <section className="order-section">
          <h2>Order Details</h2>
          
          <div className="order-items">
            {orderDetails.items?.map((item, index) => (
              <div key={index} className="order-item">
                <span>{item.name} x{item.quantity}</span>
                <span>Rs. {item.price * item.quantity}</span>
              </div>
            ))}
            
            <div className="order-item">
              <span>Charity Donation</span>
              <span>Rs. {orderDetails.charityDonation}</span>
            </div>
            
            <div className="order-item discount">
              <span>Loyalty Reward discount</span>
              <span>- Rs. {orderDetails.loyaltyDiscount}</span>
            </div>
            
            <div className="order-item">
              <span>Delivery Fee</span>
              <span>Rs. {orderDetails.deliveryFee}</span>
            </div>

            <div className="order-item total">
              <span>Total</span>
              <span>Rs. {orderDetails.total}</span>
            </div>
          </div>
        </section>

        <section className="delivery-section">
          <div className="delivery-info">
            <div className="info-row">
              <span className="icon">📍</span>
              <span>Delivery Address: {orderDetails.deliveryAddress}</span>
            </div>
            
            <div className="info-row">
              <span className="icon">⏱️</span>
              <span>Estimated Delivery: {orderDetails.estimatedDelivery}</span>
            </div>
            
            <div className="info-row">
              <span className="icon">🚚</span>
              <span>Delivery Method: {orderDetails.deliveryMethod}</span>
            </div>
          </div>
        </section>

        <section className="payment-section">
          <h2>Payment Method</h2>
          <div className="payment-info">
            <span className="secure-icon">🔒</span>
            <span>{orderDetails.paymentMethod}</span>
          </div>
        </section>

        <button className="confirm-button" onClick={handleClick}>
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;

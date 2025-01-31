import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderTracking.css";

const orderStages = [
  {
    id: "received",
    label: "Order Received",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
    description: "Restaurant is confirming your order",
  },
  {
    id: "preparing",
    label: "Preparing",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M15 11v.01M11 11v.01M17 7l2 3h2l-2 4h-3M4 7l-2 3H0l2 4h3M3 3h18v4H3V3zm3 11h12l1 7H5l1-7z" />
      </svg>
    ),
    description: "Chef is preparing your delicious meal",
  },
  {
    id: "outForDelivery",
    label: "Out for Delivery",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    description: "Your order is on its way",
  },
  {
    id: "delivered",
    label: "Delivered",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    description: "Enjoy your meal!",
  },
];

const Stages = ({ currentStatus }) => {
  const currentIndex = orderStages.findIndex((stage) => stage.id === currentStatus);

  return (
    <div className="stages">
      {orderStages.map((stage, index) => (
        <div
          key={stage.id}
          className={`stage ${
            stage.id === currentStatus
              ? "active"
              : index < currentIndex
              ? "completed"
              : ""
          }`}
        >
          <div className="stage-icon">{stage.icon}</div>
          <span className="stage-label">{stage.label}</span>
        </div>
      ))}
    </div>
  );
};

const ProgressBar = ({ currentStatus }) => {
  const currentIndex = orderStages.findIndex((stage) => stage.id === currentStatus);
  const progress = ((currentIndex + 1) / orderStages.length) * 100;

  return (
    <div className="progress-bar">
      <div
        className="progress-value"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

const StatusDetails = ({ currentStatus }) => {
  const currentStage = orderStages.find((stage) => stage.id === currentStatus);

  return (
    <div className="status-details">
      <div className="status-content">
        <div className="stage-icon">{currentStage.icon}</div>
        <div>
          <h3>{currentStage.label}</h3>
          <p>{currentStage.description}</p>
        </div>
      </div>
    </div>
  );
};

const OrderItems = () => {
  // Retrieve order items, charity donation, and loyalty discount from localStorage
  const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
  const selectedCharity = JSON.parse(localStorage.getItem("selectedCharity"));
  const selectedDiscount = JSON.parse(localStorage.getItem("selectedDiscount"));

  const total = savedCart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const charityDonation = selectedCharity ? parseInt(selectedCharity.amount.replace('Rs. ', '')) : 0;
  const loyaltyDiscount = selectedDiscount ? (total * parseInt(selectedDiscount.title) / 100) : 0;
  const deliveryFee = 60;

  const finalTotal = total + charityDonation - loyaltyDiscount + deliveryFee;

  return (
    <div className="order-items">
      <h3>Order Details</h3>
      {savedCart.map((item, index) => (
        <div key={index} className="order-item">
          <div>
            <span>{item.name}</span>
            <span>x {item.quantity}</span>
          </div>
          <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      <div className="order-item">
        <span>Charity Donation</span>
        <span>Rs. {charityDonation.toFixed(2)}</span>
      </div>
      <div className="order-item discount">
        <span>Loyalty Reward discount</span>
        <span>- Rs. {loyaltyDiscount.toFixed(2)}</span>
      </div>
      <div className="order-item">
        <span>Delivery Fee</span>
        <span>Rs. {deliveryFee.toFixed(2)}</span>
      </div>
      <div className="total-row">
        <span>Total</span>
        <span>Rs. {finalTotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

const OrderTracking = () => {
  const [currentStatus, setCurrentStatus] = useState("received");
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < orderStages.length - 1) {
        currentIndex++;
        setCurrentStatus(orderStages[currentIndex].id);
      } else {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <div className="card-header">
        <h1 className="card-title">Order Tracking</h1>
        <div className="order-id">Order #FO-12345</div>
      </div>
      <div className="card-content">
        <div className="progress-container">
          <Stages currentStatus={currentStatus} />
          <ProgressBar currentStatus={currentStatus} />
        </div>
        <StatusDetails currentStatus={currentStatus} />
        <OrderItems />
        <div className="delivery-info">
          <div className="delivery-row">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>Estimated Delivery: 30-45 minutes</span>
          </div>
          <div className="delivery-row">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Delivering from: Pizzeria Delizioso</span>
          </div>
        </div>
        <div className="buttons">
          <button className="button button-outline">Contact Support</button>
          <button className="button button-primary" onClick={handleClick}>Back To Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;

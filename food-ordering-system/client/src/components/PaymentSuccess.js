import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleGoTrack = () => {
    navigate("/track");
  };

  return (
    <div className="payment-success-container">
      <h1>🎉 Payment Successful!</h1>
      <p>Your order has been confirmed. Thank you for your purchase!</p>
      <button onClick={handleGoTrack}>Track</button>
    </div>
  );
};

export default PaymentSuccess;

import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>❌ Payment Failed</h1>
      <p>Something went wrong. Please try again.</p>
      <button onClick={() => navigate("/confirm-order")}>Try Again</button>
    </div>
  );
};

export default PaymentFailed;

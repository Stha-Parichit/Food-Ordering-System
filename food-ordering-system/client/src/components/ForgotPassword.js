import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks submission state
  const [cooldown, setCooldown] = useState(0); // Cooldown timer in seconds

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || cooldown > 0) return; // Prevent submission during cooldown

    setIsSubmitting(true); // Disable the button and show "Sending..."
    setMessage(""); // Clear any previous messages

    try {
      const response = await axios.post("http://localhost:5000/forgot-password", { email });
      setMessage(response.data.message);
      setCooldown(60); // Start the 1-minute cooldown
    } catch (err) {
      setMessage(err.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false); // Re-enable the button (if cooldown is over)
    }
  };

  // Countdown logic for the cooldown timer
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer); // Cleanup the timer on unmount
  }, [cooldown]);

  return (
    <div className="forgot-password">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting || cooldown > 0}>
          {isSubmitting
            ? "Sending..." 
            : cooldown > 0
            ? `Wait ${cooldown}s`
            : "Send Reset Link"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;

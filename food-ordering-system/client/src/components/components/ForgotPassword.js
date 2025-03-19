import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Typography, Container, Paper, Box, CircularProgress } from "@mui/material";

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
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, boxShadow: 4 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4, color: "#1976d2" }}>
          Forgot Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
            InputLabelProps={{
              style: { color: "#1976d2" },
            }}
            inputProps={{
              style: { padding: "10px" },
            }}
          />
          <Box sx={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting || cooldown > 0}
              sx={{
                mb: 2,
                padding: "12px",
                fontSize: "16px",
                textTransform: "none",
                borderRadius: 2,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : cooldown > 0 ? (
                `Wait ${cooldown}s`
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </Box>
        </form>
        {message && (
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: message.includes("success") ? "green" : "red",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPassword;

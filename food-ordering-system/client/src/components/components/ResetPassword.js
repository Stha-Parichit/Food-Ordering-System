import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Typography, Container, Paper, Box, CircularProgress } from "@mui/material";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:5000/reset-password", {
        token,
        email,
        newPassword,
      });
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, boxShadow: 4 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4, color: "#1976d2" }}>
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            variant="outlined"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
              disabled={isSubmitting}
              sx={{
                mb: 2,
                padding: "12px",
                fontSize: "16px",
                textTransform: "none",
                borderRadius: 2,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor: "#1565c0",
                  transform: "scale(1.05)", // Scale effect on hover
                },
                "&:active": {
                  transform: "scale(0.98)", // Button press effect
                },
                transition: "transform 0.2s ease-in-out, background-color 0.3s ease", // Smooth transition
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Reset Password"
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

export default ResetPassword;

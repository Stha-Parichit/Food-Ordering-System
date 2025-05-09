import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Box, 
  CircularProgress,
  InputAdornment,
  IconButton
} from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import LockResetIcon from '@mui/icons-material/LockReset';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || cooldown > 0) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/forgot-password", { email });
      setMessage(response.data.message);
      setCooldown(60);
    } catch (err) {
      setMessage(err.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 4
      }}>
        <Box sx={{
          backgroundColor: '#3a86ff',
          borderRadius: '50%',
          width: 70,
          height: 70,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2
        }}>
          <LockResetIcon sx={{ color: 'white', fontSize: 40 }} />
        </Box>
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          backgroundImage: 'linear-gradient(90deg, #3a86ff, #8338ec)',
          backgroundClip: 'text',
          color: 'transparent',
          mb: 1
        }}>
          Forgot Password?
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          No worries! Enter your email and we'll send you a reset link.
        </Typography>
      </Box>

      <Paper 
        elevation={4} 
        sx={{ 
          padding: 4, 
          borderRadius: 3,
          background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)'
        }}
      >
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
          />
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting || cooldown > 0}
            sx={{
              py: 1.5,
              fontSize: "16px",
              borderRadius: 2,
              background: cooldown > 0 ? 'grey.400' : 'linear-gradient(90deg, #3a86ff, #8338ec)',
              textTransform: "none",
              transition: "all 0.3s ease",
              boxShadow: '0 4px 15px rgba(58, 134, 255, 0.3)',
              "&:hover": {
                boxShadow: '0 8px 25px rgba(58, 134, 255, 0.5)',
                transform: "translateY(-2px)"
              },
              "&:active": {
                transform: "translateY(1px)"
              }
            }}
            endIcon={cooldown > 0 ? null : <SendIcon />}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : cooldown > 0 ? (
              `Try again in ${cooldown}s`
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>

        {message && (
          <Box sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            backgroundColor: message.includes("success") ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
            border: `1px solid ${message.includes("success") ? 'rgba(46, 204, 113, 0.3)' : 'rgba(231, 76, 60, 0.3)'}`,
          }}>
            <Typography
              variant="body2"
              sx={{
                color: message.includes("success") ? '#27ae60' : '#e74c3c',
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              {message}
            </Typography>
          </Box>
        )}
      </Paper>
      
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Remember your password? <Button sx={{ textTransform: 'none', fontWeight: 'bold' }} href="/login">Back to Login</Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
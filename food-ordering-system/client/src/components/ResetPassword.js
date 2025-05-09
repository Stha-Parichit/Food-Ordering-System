import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  IconButton,
  FormControl,
  FormHelperText
} from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");

  // Password validation and strength checking
  const checkPasswordStrength = (password) => {
    let strength = 0;
    let feedback = [];

    if (password.length >= 8) {
      strength += 25;
    } else {
      feedback.push("Use at least 8 characters");
    }

    if (/[A-Z]/.test(password)) {
      strength += 25;
    } else {
      feedback.push("Add uppercase letters");
    }

    if (/[0-9]/.test(password)) {
      strength += 25;
    } else {
      feedback.push("Add numbers");
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 25;
    } else {
      feedback.push("Add special characters");
    }

    setPasswordStrength(strength);
    setPasswordFeedback(feedback.join(" • "));
  };

  const handlePasswordChange = (e) => {
    const newPass = e.target.value;
    setNewPassword(newPass);
    checkPasswordStrength(newPass);
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "#e74c3c";
    if (passwordStrength <= 50) return "#f39c12";
    if (passwordStrength <= 75) return "#3498db";
    return "#27ae60";
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match. Please try again.");
      return;
    }

    if (passwordStrength < 75) {
      setMessage("Please choose a stronger password");
      return;
    }

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
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 4
      }}>
        <Box sx={{
          backgroundColor: '#8338ec',
          borderRadius: '50%',
          width: 70,
          height: 70,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2
        }}>
          <LockOpenIcon sx={{ color: 'white', fontSize: 40 }} />
        </Box>
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          backgroundImage: 'linear-gradient(90deg, #8338ec, #3a86ff)',
          backgroundClip: 'text',
          color: 'transparent',
          mb: 1
        }}>
          Create New Password
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          Your password should be strong and secure
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
          <FormControl fullWidth sx={{ mb: 3 }}>
            <TextField
              label="New Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={handlePasswordChange}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
            
            {newPassword && (
              <>
                <Box sx={{ mt: 1, mb: 1 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 0.5
                  }}>
                    <Typography variant="caption" color="text.secondary">
                      Password strength: {passwordStrength <= 25 ? "Weak" : 
                                        passwordStrength <= 50 ? "Fair" : 
                                        passwordStrength <= 75 ? "Good" : "Strong"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: getStrengthColor() }}>
                      {passwordStrength}%
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: 4, backgroundColor: '#e0e0e0', borderRadius: 2 }}>
                    <Box 
                      sx={{ 
                        width: `${passwordStrength}%`, 
                        height: '100%', 
                        backgroundColor: getStrengthColor(),
                        borderRadius: 2,
                        transition: 'width 0.3s ease, background-color 0.3s ease'
                      }} 
                    />
                  </Box>
                </Box>
                {passwordFeedback && (
                  <FormHelperText sx={{ color: getStrengthColor() }}>
                    {passwordFeedback}
                  </FormHelperText>
                )}
              </>
            )}
          </FormControl>

          <TextField
            label="Confirm Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
            error={confirmPassword !== "" && newPassword !== confirmPassword}
            helperText={confirmPassword !== "" && newPassword !== confirmPassword ? "Passwords don't match" : ""}
          />
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{
              py: 1.5,
              fontSize: "16px",
              borderRadius: 2,
              background: 'linear-gradient(90deg, #8338ec, #3a86ff)',
              textTransform: "none",
              transition: "all 0.3s ease",
              boxShadow: '0 4px 15px rgba(131, 56, 236, 0.3)',
              "&:hover": {
                boxShadow: '0 8px 25px rgba(131, 56, 236, 0.5)',
                transform: "translateY(-2px)"
              },
              "&:active": {
                transform: "translateY(1px)"
              }
            }}
            endIcon={<CheckCircleOutlineIcon />}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Reset Password"
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
    </Container>
  );
};

export default ResetPassword;
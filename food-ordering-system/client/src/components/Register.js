import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  Divider,
  useTheme,
  useMediaQuery,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const steps = ['Account Setup', 'Personal Details', 'Review & Confirm'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({...errors, [name]: ''});
    }
  };

  const validateStep = (step) => {
    let tempErrors = {};
    let isValid = true;

    if (step === 0) {
      if (!form.email) {
        tempErrors.email = "Email is required";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        tempErrors.email = "Email is invalid";
        isValid = false;
      }
      
      if (!form.password) {
        tempErrors.password = "Password is required";
        isValid = false;
      } else if (form.password.length < 6) {
        tempErrors.password = "Password must be at least 6 characters";
        isValid = false;
      }
      
      if (!form.confirmPassword) {
        tempErrors.confirmPassword = "Please confirm your password";
        isValid = false;
      } else if (form.password !== form.confirmPassword) {
        tempErrors.confirmPassword = "Passwords don't match";
        isValid = false;
      }
    } else if (step === 1) {
      if (!form.fullName) {
        tempErrors.fullName = "Full name is required";
        isValid = false;
      }
      
      if (form.phone && !/^\+?[0-9\s-()]{8,}$/.test(form.phone)) {
        tempErrors.phone = "Please enter a valid phone number";
        isValid = false;
      }
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setMessage("");
      setActiveStep(activeStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    setMessage("");
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      setMessage("Please accept the terms and conditions to continue");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/register', {
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        phone: form.phone,
        address: form.address
      });

      setMessage("Registration successful! Redirecting to login...");
      setMessageType("success");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Error registering user. Please try again.');
      }
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
              Create your account
            </Typography>
            
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              variant="outlined"
              value={form.email}
              onChange={handleChange}
              required
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={form.password}
              onChange={handleChange}
              required
              error={!!errors.password}
              helperText={errors.password}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                      aria-label="toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Password must be at least 6 characters long and contain a mix of letters and numbers.
            </Typography>
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
              Tell us about yourself
            </Typography>
            
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              variant="outlined"
              value={form.fullName}
              onChange={handleChange}
              required
              error={!!errors.fullName}
              helperText={errors.fullName}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              variant="outlined"
              value={form.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone || "Optional, but useful for delivery updates"}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
            <TextField
              fullWidth
              label="Delivery Address"
              name="address"
              variant="outlined"
              value={form.address}
              onChange={handleChange}
              multiline
              rows={3}
              error={!!errors.address}
              helperText={errors.address || "Optional, you can add or change this later"}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HomeIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
              Almost there!
            </Typography>
            
            <Box sx={{ 
              bgcolor: 'rgba(255, 87, 34, 0.06)', 
              p: 3, 
              borderRadius: 2,
              mb: 3,
              border: '1px solid rgba(255, 87, 34, 0.2)'
            }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#E64A19' }}>
                Registration Summary
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Email:</Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>{form.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Full Name:</Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>{form.fullName || "Not provided"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Phone:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{form.phone || "Not provided"}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Delivery Address:</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{form.address || "Not provided"}</Typography>
                </Grid>
              </Grid>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mt: 2, 
                bgcolor: 'rgba(76, 175, 80, 0.1)', 
                p: 1.5, 
                borderRadius: 1.5 
              }}>
                <CheckCircleIcon color="success" sx={{ mr: 1.5 }} />
                <Typography variant="body2">
                  Your account is ready to be created. Review the details above and complete your registration.
                </Typography>
              </Box>
            </Box>
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                  sx={{ 
                    color: '#FF5722',
                    '&.Mui-checked': {
                      color: '#FF5722',
                    } 
                  }}
                />
              }
              label={
                <Typography variant="body2">
                  I accept the <a href="#" style={{ color: '#FF5722', textDecoration: 'none', fontWeight: 500 }}>Terms and Conditions</a> and <a href="#" style={{ color: '#FF5722', textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</a>. I also agree to 
                  receive promotional emails and special offers.
                </Typography>
              }
              sx={{ mb: 3 }}
            />
          </>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container 
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/images/restaurant-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 2, sm: 3, md: 4, lg: 5 }
      }}
    >
      <Paper 
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: 600, md: 680 },
          borderRadius: { xs: 2, sm: 3, md: 4 },
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 15px 50px rgba(0,0,0,0.3)',
          },
          animation: 'fadeIn 0.5s ease-out',
          '@keyframes fadeIn': {
            '0%': {
              opacity: 0,
              transform: 'translateY(20px)'
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)'
            }
          }
        }}
      >
        {/* Restaurant brand header */}
        <Box sx={{
          bgcolor: '#FF5722',
          color: 'white',
          padding: { xs: 2.5, sm: 3, md: 3.5 },
          textAlign: 'center',
          position: 'relative',
          backgroundImage: 'linear-gradient(135deg, #FF5722, #E64A19)',
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 1, sm: 1.5, md: 2 },
            mb: { xs: 0.5, sm: 1 }
          }}>
            <RestaurantIcon sx={{ fontSize: { xs: 28, sm: 32, md: 36 } }} />
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight="bold"
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                letterSpacing: '0.5px',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              FoodDelight
            </Typography>
          </Box>
          <Typography 
            variant="body1"
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '1rem' }, 
              opacity: 0.9,
              maxWidth: '80%',
              mx: 'auto'
            }}
          >
            Create your account and start ordering delicious food today!
          </Typography>
          
          {/* Food icons decoration */}
          <Box sx={{ 
            position: 'absolute',
            top: 10,
            left: 10,
            opacity: 0.6,
            transform: 'rotate(-15deg)',
            display: { xs: 'none', sm: 'block' }
          }}>
            <FastfoodIcon />
          </Box>
          <Box sx={{ 
            position: 'absolute',
            bottom: 10,
            right: 10,
            opacity: 0.6,
            transform: 'rotate(15deg)',
            display: { xs: 'none', sm: 'block' }
          }}>
            <LocalPizzaIcon />
          </Box>
        </Box>
        
        <Box sx={{ 
          p: { xs: 3, sm: 4, md: 5 }, 
          pt: { xs: 3, sm: 4 },
          maxHeight: { md: '70vh' },
          overflowY: { md: 'auto' },
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#FF5722',
            opacity: 0.7,
            borderRadius: '4px',
          },
        }}>
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel
            sx={{ 
              mb: { xs: 3, sm: 4 },
              '& .MuiStepLabel-root .Mui-completed': {
                color: '#FF5722', 
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: '#FF5722', 
              },
              '& .MuiStepLabel-label': {
                mt: 1,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <form onSubmit={handleSubmit}>
            {getStepContent(activeStep)}
            
            {message && (
              <Alert 
                severity={messageType || "error"} 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  animation: 'fadeIn 0.3s ease-out',
                }}
                variant="filled"
              >
                {message}
              </Alert>
            )}
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 3,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}>
              <Button
                type="button"
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                sx={{ 
                  color: '#FF5722', 
                  borderColor: '#FF5722',
                  '&:hover': {
                    borderColor: '#E64A19',
                    backgroundColor: 'rgba(255, 87, 34, 0.04)',
                  },
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                  order: { xs: 2, sm: 1 },
                  flex: { xs: '1', sm: '0 0 auto' },
                }}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="contained"
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                disabled={loading}
                endIcon={activeStep === steps.length - 1 ? null : <ArrowForwardIcon />}
                sx={{ 
                  bgcolor: '#FF5722',
                  '&:hover': {
                    bgcolor: '#E64A19',
                  },
                  '&:disabled': {
                    bgcolor: 'rgba(255, 87, 34, 0.5)',
                    color: 'white',
                  },
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                  order: { xs: 1, sm: 2 },
                  flex: { xs: '1', sm: '0 0 auto' },
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    bgcolor: '#E64A19',
                  }
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Processing...
                  </>
                ) : (
                  activeStep === steps.length - 1 ? 'Complete Registration' : 'Next'
                )}
              </Button>
            </Box>
          </form>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="body1" align="center">
            Already have an account?{' '}
            <a 
              href="/login" 
              style={{ 
                textDecoration: 'none', 
                color: '#FF5722',
                fontWeight: 'bold',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#E64A19'}
              onMouseOut={(e) => e.currentTarget.style.color = '#FF5722'}
            >
              Login here
            </a>
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 3, 
            gap: 0.5,
            color: '#757575',
            flexWrap: 'wrap',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center'
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Fast delivery
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                •
              </Typography>
            </Box>
            
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Easy ordering
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                •
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Great food
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  FormControlLabel, 
  Checkbox, 
  CircularProgress,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Grid
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email: form.email,
        password: form.password,
      });

      setMessage(response.data.message);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token); 
        localStorage.setItem('userEmail', form.email);
        localStorage.setItem("user_id", response.data.userId);

        // Navigate based on user ID
        if (response.data.userId === 1) {
          window.location.href = '/admin-dashboard';
        } else {
          window.location.href = '/dashboard';
        }
      }
    } catch (error) {
      setMessage(error.response?.status === 401 ? 'Invalid credentials. Please try again.' : 'Error logging in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    setLoading(true);
    try {
      const googleToken = response.credential;
      const userInfo = await axios.post('http://localhost:5000/api/google-login', { token: googleToken });

      if (userInfo.data.token) {
        localStorage.setItem('token', userInfo.data.token);
        localStorage.setItem('userEmail', userInfo.data.email);
        localStorage.setItem('user_id', userInfo.data.userId);
        window.location.href = '/home';
      }
    } catch (error) {
      setMessage('Error logging in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: '100vh',
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), 
          url("/images/food-background.jpg")
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 2, md: 4 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at center, rgba(255,87,34,0.15) 0%, rgba(0,0,0,0) 70%)',
          zIndex: 1
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url('/images/pattern-overlay.png')`,
          backgroundSize: '200px',
          opacity: 0.1,
          zIndex: 1
        }
      }}
    >
      {/* Floating food icons */}
      <Box sx={{ 
        position: 'absolute',
        top: '10%',
        left: '10%',
        animation: 'float 8s ease-in-out infinite',
        zIndex: 1,
        opacity: 0.6,
        display: { xs: 'none', md: 'block' }
      }}>
        <FastfoodIcon sx={{ fontSize: 60, color: '#FFB74D' }} />
      </Box>
      <Box sx={{ 
        position: 'absolute',
        top: '20%',
        right: '15%',
        animation: 'float 12s ease-in-out infinite',
        zIndex: 1,
        opacity: 0.6,
        display: { xs: 'none', md: 'block' }
      }}>
        <LocalPizzaIcon sx={{ fontSize: 70, color: '#FFAB91' }} />
      </Box>
      <Box sx={{ 
        position: 'absolute',
        bottom: '15%',
        right: '10%',
        animation: 'float 10s ease-in-out infinite',
        zIndex: 1,
        opacity: 0.6,
        display: { xs: 'none', md: 'block' }
      }}>
        <EmojiFoodBeverageIcon sx={{ fontSize: 50, color: '#FFCC80' }} />
      </Box>

      <Grid 
        container 
        sx={{ 
          maxWidth: { xs: '100%', md: 1100 },
          minHeight: { md: '600px' },
          position: 'relative',
          zIndex: 2,
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 25px 80px rgba(0,0,0,0.3)'
        }}
      >
        {/* Left side content */}
        <Grid 
          item 
          md={6} 
          lg={7} 
          sx={{ 
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 6,
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)',
            backdropFilter: 'blur(8px)',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url("/images/food-pattern.svg")',
              backgroundSize: '400px',
              opacity: 0.1,
              zIndex: -1
            }
          }}
        >
          <Box 
            sx={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              color: 'white',
              maxWidth: '90%'
            }}
          >
            <Box sx={{ 
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}>
              <RestaurantIcon sx={{ fontSize: 40, color: '#FF5722' }} />
              <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom sx={{
                background: 'linear-gradient(45deg, #FF5722 30%, #FFAB91 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                YOO!!!
              </Typography>
            </Box>
            
            <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
              Your favorite meals, delivered at your doorstep
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 2, 
              mb: 4, 
              gap: 4
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                p: 2, 
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-5px)' }
              }}>
                <FastfoodIcon sx={{ fontSize: 40, color: '#FF5722', mb: 1 }} />
                <Typography variant="body2">Fast Delivery</Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                p: 2, 
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-5px)' }
              }}>
                <LocalPizzaIcon sx={{ fontSize: 40, color: '#FF5722', mb: 1 }} />
                <Typography variant="body2">Premium Quality</Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                p: 2, 
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-5px)' }
              }}>
                <EmojiFoodBeverageIcon sx={{ fontSize: 40, color: '#FF5722', mb: 1 }} />
                <Typography variant="body2">Best Experience</Typography>
              </Box>
            </Box>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mt: 4,
                p: 3,
                borderRadius: 3,
                backgroundColor: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                lineHeight: 1.8
              }}
            >
              "Discover a world of culinary delights with our premium food delivery service. 
              From local favorites to exotic cuisines, we bring the restaurant experience to your home.
              Order now and experience the difference with FoodDelight!"
            </Typography>
          </Box>
        </Grid>

        {/* Login form side */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          lg={5} 
          component={Paper} 
          elevation={24}
          sx={{
            borderRadius: { xs: 4, md: '0 1rem 1rem 0' },
            overflow: 'hidden',
            boxShadow: '0 15px 50px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            background: 'white',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle at top right, rgba(255,87,34,0.1), transparent 70%)',
              zIndex: 0,
              borderRadius: '0 0 0 100%'
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle at bottom left, rgba(255,87,34,0.1), transparent 70%)',
              zIndex: 0,
              borderRadius: '0 100% 0 0'
            }
          }}
        >
          {/* Restaurant brand header for mobile only */}
          <Box sx={{
            bgcolor: '#FF5722',
            color: 'white',
            padding: 3,
            textAlign: 'center',
            position: 'relative',
            display: { xs: 'block', md: 'none' },
            boxShadow: '0 4px 20px rgba(255,87,34,0.3)'
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              mb: 1
            }}>
              <RestaurantIcon fontSize="large" />
              <Typography variant="h4" component="h1" fontWeight="bold">
              YOO!!!
              </Typography>
            </Box>
            <Typography variant="body1">
              Your favorite meals, delivered at your doorstep
            </Typography>
            
            <Box sx={{ 
              position: 'absolute',
              top: 10,
              left: 10,
              opacity: 0.5
            }}>
              <FastfoodIcon />
            </Box>
            <Box sx={{ 
              position: 'absolute',
              bottom: 10,
              right: 10,
              opacity: 0.5
            }}>
              <LocalPizzaIcon />
            </Box>
          </Box>
          
          <Box sx={{ 
            p: { xs: 3, sm: 4, md: 5 }, 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            zIndex: 1 
          }}>
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center', 
              mb: 4 
            }}>
              <RestaurantIcon sx={{ color: '#FF5722', fontSize: 32, mr: 1 }} />
              <Typography variant="h5" component="h1" fontWeight="bold" color="#FF5722">
              YOO!!!
              </Typography>
            </Box>

            <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
              Welcome Back!
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
              Log in to continue your delicious journey
            </Typography>
            
            <form onSubmit={handleSubmit} style={{ flexGrow: 1 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, color: 'text.secondary' }}>
                      <EmailIcon />
                    </Box>
                  ),
                  sx: { borderRadius: 2 }
                }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, color: 'text.secondary' }}>
                      <LockIcon />
                    </Box>
                  ),
                  sx: { borderRadius: 2 }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <FormControlLabel
                  control={<Checkbox style={{ color: '#FF5722' }} />}
                  label="Remember me"
                />
                <Typography variant="body2">
                  <a href="/forgot-password" style={{ textDecoration: 'none', color: '#FF5722' }}>
                    Forgot password?
                  </a>
                </Typography>
              </Box>
              <Button 
                fullWidth 
                variant="contained" 
                type="submit" 
                size="large"
                disabled={loading}
                sx={{ 
                  mb: 3,
                  py: 1.5,
                  bgcolor: '#FF5722',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(255,87,34,0.3)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: '#E64A19',
                    boxShadow: '0 6px 15px rgba(255,87,34,0.4)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login & Order Now'}
              </Button>

              {message && (
                <Box sx={{ 
                  mb: 3, 
                  p: 1.5, 
                  bgcolor: message.includes('Error') ? 'rgba(255,82,82,0.1)' : 'rgba(76,175,80,0.1)',
                  borderRadius: 2,
                  color: message.includes('Error') ? '#f44336' : '#4caf50',
                  textAlign: 'center'
                }}>
                  <Typography variant="body2">{message}</Typography>
                </Box>
              )}

              <Divider sx={{ mb: 3 }}>
                <Typography variant="body2" color="textSecondary">OR</Typography>
              </Divider>

              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => setMessage('Google login failed. Please try again.')}
                  useOneTap
                  size="large"
                  shape="rectangular"
                  text="Login with Google"
                  theme="outline"
                />
              </Box>
            </form>
            
            <Box sx={{ textAlign: 'center', mt: 'auto' }}>
              <Typography variant="body1">
                New to  YOO!!!? {' '}
                <a 
                  href="/register" 
                  style={{ 
                    textDecoration: 'none', 
                    color: '#FF5722',
                    fontWeight: 'bold' 
                  }}
                >
                  Create an account
                </a>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
      
      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </Container>
  );
};

export default Login;
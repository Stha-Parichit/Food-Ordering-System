import React, { useState } from 'react';
import axios from 'axios'; 
import { Container, Box, TextField, Button, Typography, FormControlLabel, Checkbox, CircularProgress } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
        window.location.href = '/home';
      }
    } catch (error) {
      setMessage(error.response?.status === 401 ? 'Invalid credentials. Please try again.' : 'Error logging in. Please try again.');
    } finally {
      setLoading(false); // Stop loading after the request
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
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
        <img src="/images/team.png" alt="User Icon" style={{ width: 60, height: 60, marginBottom: 16 }} />
        <Typography variant="h5" component="h1" gutterBottom>
          Welcome Back!
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
          Please login to your account to continue ordering your favorite meals.
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
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
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <FormControlLabel
              control={<Checkbox />}
              label="Remember me"
            />
            <Typography variant="body2">
              <a href="/forgot-password" style={{ textDecoration: 'none' }}>Forgot password?</a>
            </Typography>
          </Box>
          <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mb: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </form>

        {/* Google Login Button */}
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => setMessage('Google login failed. Please try again.')}
          useOneTap
          size="large"
          shape="rectangular"
          text="Login with Google"
          theme="outline"
          sx={{ mb: 2 }}
        />
        
        {message && <Typography variant="body2" color="error" sx={{ mb: 2, textAlign: 'center' }}>{message}</Typography>}
        <Typography variant="body2" align="center">
          Don’t have an account? <a href="/register" style={{ textDecoration: 'none' }}>Sign up</a>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;

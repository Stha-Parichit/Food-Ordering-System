import React, { useState } from 'react';
import axios from 'axios'; // For making API requests
import './Login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Send login request to the server
      const response = await axios.post('http://localhost:5000/login', {
        email: form.email,
        password: form.password,
      });
  
      setMessage(response.data.message);
  
      // If login is successful, save the JWT and user email in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Save the token in localStorage
        localStorage.setItem('userEmail', form.email); // Save user email in localStorage
        // Redirect to home
        window.location.href = '/home'; 
      }
    } catch (error) {
      if (error.response) {
        // Server responded with an error (e.g., invalid credentials)
        if (error.response.status === 401) {
          setMessage('Invalid credentials. Please try again.');
        } else {
          setMessage('Error logging in. Please try again.');
        }
      } else {
        // Network or other issues
        setMessage('Network error. Please try again later.');
      }
    }
  };  

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="icon">
          <img src="/images/team.png" alt="User Icon" />
        </div>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
          />
          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot-password">Forgot password?</a>
          </div>
          <button type="submit">Login</button>
        </form>
        {message && <p className="message">{message}</p>}
        <p>
          Don’t have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

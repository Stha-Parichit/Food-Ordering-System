import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Register.css';

const Register = () => {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords don't match!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', {
        email: form.email,
        password: form.password,
      });

      setMessage(response.data.message);

      // Redirect to login page after successful registration
      navigate('/login');  // Use navigate to redirect to login
    } catch (error) {
      setMessage('Error registering user. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <h1>Welcome to Food Ordering</h1>
        <p>Register now to explore delicious food options!</p>
      </div>
      <div className="register-right">
        <h2>Create Your Account</h2>
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />
          <div className="terms">
            <input type="checkbox" required />
            <span>I accept terms and conditions</span>
          </div>
          <button type="submit">Register</button>
          <p>
          Already have an account? <a href="/login">Login</a>
          </p>
        </form>
        {message && <p className="message">{message}</p>}
        
      </div>
    </div>
  );
};

export default Register;

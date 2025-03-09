import React, { useState, useEffect } from 'react';
import { FaBell, FaShoppingCart } from 'react-icons/fa';
import { Button, TextField, Link, IconButton, AppBar, Toolbar, Typography, Grid, Box, Card, CardContent, Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const monthlyData = [
    { month: 'Jan', orders: 20, amount: 10000 },
    { month: 'May', orders: 40, amount: 8000 },
    { month: 'Aug', orders: 50, amount: 10000 },
    { month: 'Dec', orders: 40, amount: 8000 }
  ];

  const userEmail = localStorage.getItem('userEmail');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : '';

  const handleMouseEnter = () => setIsDropdownVisible(true);
  const handleMouseLeave = () => setIsDropdownVisible(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const profileDropdown = document.querySelector('.profile-dropdown');
      const profileIcon = document.querySelector('.profile-icon-container');
      if (profileDropdown && !profileDropdown.contains(e.target) && !profileIcon.contains(e.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Profile Dropdown Handlers
  const handleClickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleCartClick = () => {
    navigate("/cart");
  };

  const [notifications, setNotifications] = useState([]);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  return (
    <div className="dashboard">
      <AppBar position="sticky" sx={{ backgroundColor: "#fff", color: "#333" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src="/images/logo.png" alt="Logo" style={{ width: 40, height: 40 }} />
            <Typography variant="h6" sx={{ ml: 2, color: "#333" }}>
              YOO!!!
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mx: "auto" }}>
            <Button sx={{ color: "#333" }} component="a" href="/home">
              Home
            </Button>
            <Button sx={{ color: "#333" }} component="a" href="/categories">
              Categories
            </Button>
            <Button sx={{ color: "#333" }} component="a" href="/dashboard">
              Dashboard
            </Button>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={handleNotificationClick}>
              <FaBell style={{ fontSize: "1.5rem", color: "#333" }} />
            </IconButton>
            <IconButton onClick={handleCartClick}>
              <FaShoppingCart style={{ fontSize: "1.5rem", color: "#333" }} />
            </IconButton>
            <IconButton onClick={handleClickProfile}>
              <AccountCircleIcon sx={{ fontSize: "2rem", color: "#333" }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseProfileMenu}
              sx={{ mt: 2 }}
            >
              <MenuItem>{userEmail}</MenuItem>
              <Link to="/profile" style={{ textDecoration: "none", color: "black" }}>
                <MenuItem>Profile</MenuItem>
              </Link>
              <MenuItem onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("userEmail"); navigate("/login"); }}>
                Logout
              </MenuItem>
            </Menu>
            <Menu
              anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationClose}
              sx={{ mt: 2 }}
            >
              <MenuItem disabled>Notifications</MenuItem>
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <MenuItem key={index}>{notification.message}</MenuItem>
                ))
              ) : (
                <MenuItem>No notifications</MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Typography variant="h4" gutterBottom className="dashboard-title" align="center" sx={{ mt: 5, fontWeight: 'bold' }}>
        My Impact
      </Typography>

      {/* Impact Stats */}
      <Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="h6" align="center" sx={{ fontSize: '2rem' }}>❤️</Typography>
              <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>Rs. 15000</Typography>
              <Typography variant="body1" align="center" color="textSecondary">Donated to the community needs</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="h6" align="center" sx={{ fontSize: '2rem' }}>🎁</Typography>
              <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>8</Typography>
              <Typography variant="body1" align="center" color="textSecondary">Loyalty Stamps</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Order Summary */}
      <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" align="center" sx={{ fontSize: '2rem' }}>📦</Typography>
              <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>50</Typography>
              <Typography variant="body1" align="center" color="textSecondary">Total orders</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" align="center" sx={{ fontSize: '2rem' }}>💸</Typography>
              <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>Rs. 60000</Typography>
              <Typography variant="body1" align="center" color="textSecondary">Total spent</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Monthly Performance */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>⭐ Monthly Performance</Typography>
        <Grid container spacing={2} justifyContent="center">
          {monthlyData.map((data, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom align="center" sx={{ fontSize: '1.5rem' }}>{data.month}</Typography>
                  <Box sx={{ width: '100%', height: 10, backgroundColor: '#f0f0f0' }}>
                    <Box sx={{ width: `${(data.orders / 50) * 100}%`, height: '100%', bgcolor: '#3f51b5' }} />
                  </Box>
                  <Typography variant="body1" align="center" color="textSecondary">{data.orders} orders (Rs. {data.amount})</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer Section */}
      <footer className="home-footer" style={{ textAlign: 'center', padding: '40px', marginTop:'40px', backgroundColor: '#f0f0f0' }}>
          <Typography variant="body2" color="textSecondary">© YOO!!! All Rights Reserved</Typography>
          <Typography variant="body2" color="textSecondary">🍴 YOO!!!</Typography>
          <Typography variant="body2" color="textSecondary">
              Disclaimer: This site is only for ordering and learning to cook food.
          </Typography>
      </footer>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { FaBell } from "react-icons/fa";
import { AppBar, Toolbar, Typography, IconButton, TextField,Link, Box, Button, Grid, Card, CardContent, CardMedia, Divider, CardActions, Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const FilterPage = () => {
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

  // Profile Dropdown Handlers
  const handleClickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

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

  return (
    <div className="filter-page">
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
            <TextField variant="outlined" size="small" placeholder="Search" InputProps={{ endAdornment: <SearchIcon /> }} sx={{ bgcolor: "white", borderRadius: 1, mr: 2 }} />
            <FaBell style={{ fontSize: "1.5rem", color: "#333" }} />
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
          </Box>
        </Toolbar>
      </AppBar>

      <main className="main" style={{ padding: '20px' }}>
        <section className="food-categories">
          <Typography variant="h4" gutterBottom>Food categories</Typography>
          <Grid container spacing={3} style={{ gap: '30px', width: 'auto', display: 'flex',justifyContent: 'center', alignItems: 'center' }}>
            {['Snacks', 'Breakfast', 'Lunch', 'Pork', 'Veg'].map((category) => (
              <Grid item xs={6} sm={4} md={2} key={category}>
                <Card sx={{
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 4,
                  },
                  borderRadius: 2,
                  boxShadow: 2,
                }}>
                  <CardMedia
                    component="img"
                    image={`/images/${category.toLowerCase()}.png`}
                    alt={category}
                    sx={{
                      height: 160,
                      objectFit: 'cover',
                      borderTopLeftRadius: 2,
                      borderTopRightRadius: 2,
                    }}
                  />
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{category}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </section>

        <Divider sx={{ my: 4 }} />

        <section className="recommended-items">
          <Typography variant="h4" gutterBottom>Some foods you may like</Typography>
          <Grid container spacing={3} style={{ gap: '30px', width: 'auto', display: 'flex',justifyContent: 'center', alignItems: 'center' }}>
            {['Pizza', 'Pasta', 'Cup Cake', 'Cake', 'Brownie'].map((item) => (
              <Grid item xs={6} sm={4} md={2} key={item}>
                <Card sx={{
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 4,
                  },
                  borderRadius: 2,
                  boxShadow: 2,
                }}>
                  <CardMedia
                    component="img"
                    image={`/images/${item.toLowerCase().replace(' ', '-')}.png`}
                    alt={item}
                    sx={{
                      height: 160,
                      objectFit: 'cover',
                      borderTopLeftRadius: 2,
                      borderTopRightRadius: 2,
                    }}
                  />
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{item}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </section>

        <Divider sx={{ my: 4 }} />

        <section className="recent-items">
          <Typography variant="h4" gutterBottom>Recent items</Typography>
          <Grid container spacing={3} style={{ gap: '30px', width: 'auto', display: 'flex',justifyContent: 'center', alignItems: 'center' }}>
            {['Burger', 'Pizza', 'Omurice', 'Sushi', 'Ramen'].map((item) => (
              <Grid item xs={6} sm={4} md={2} key={item}>
                <Card sx={{
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 4,
                  },
                  borderRadius: 2,
                  boxShadow: 2,
                }}>
                  <CardMedia
                    component="img"
                    image={`/images/${item.toLowerCase()}.png`}
                    alt={item}
                    sx={{
                      height: 160,
                      objectFit: 'cover',
                      borderTopLeftRadius: 2,
                      borderTopRightRadius: 2,
                    }}
                  />
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{item}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </section>
      </main>

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

export default FilterPage;

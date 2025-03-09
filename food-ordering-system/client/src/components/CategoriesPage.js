import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { CardMedia, Box, Button, AppBar, Toolbar, IconButton } from '@mui/material';
import { Card, CardActionArea, CardContent, Grid, Typography, Select, MenuItem, TextField, Menu } from '@mui/material';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const userEmail = localStorage.getItem('userEmail');
  const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : '';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/food-items');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchCategories();
    fetchItems();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const filteredItems = items.filter((item) => {
    return (
      (selectedCategory ? item.category === selectedCategory : true) &&
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleClickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {/* Header Section */}
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
            <TextField variant="outlined" size="small" placeholder="Search" InputProps={{ endAdornment: <SearchIcon /> }} sx={{ bgcolor: "white", borderRadius: 1, mr: 2 }} onChange={handleSearchChange}/>
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

      {/* Category Filters and Search Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
        <Select value={selectedCategory} onChange={handleCategoryChange} displayEmpty>
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>
          ))}
        </Select>
        <TextField
          value={searchQuery}
          onChange={handleSearchChange}
          label="Search items"
          variant="outlined"
          sx={{ width: 300 }}
        />
      </Box>

      {/* Main Content Area */}
      <div className="main-content">
        <Grid container spacing={3} justifyContent="center" sx={{ marginTop: 3 }}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ maxWidth: 250, margin: 2 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.image_url}
                    alt={item.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${item.price}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addToCart(item)}
                  sx={{ width: '100%',
                    backgroundColor: '#ff9800',
                "&:hover": { backgroundColor: '#f57c00'}
                   }}
                >
                  Add to Cart <FaShoppingCart style={{ marginLeft: 5,  }} />
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>

      {/* Footer */}
      <footer className="home-footer" style={{ textAlign: 'center', padding: '40px', marginTop:'40px', backgroundColor: '#f0f0f0' }}>
        <Typography variant="body2" align="center">© YOO!!! All Rights Reserved</Typography>
        <Typography variant="body2" align="center">🍴 YOO!!!</Typography>
        <Typography variant="body2" align="center">Disclaimer: This site is only for ordering and learning to cook food.</Typography>
      </footer>
    </div>
  );
};

export default CategoriesPage;

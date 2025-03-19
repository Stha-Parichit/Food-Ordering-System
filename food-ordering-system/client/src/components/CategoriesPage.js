import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaBell, FaHome, FaThList, FaChartBar, FaUser } from 'react-icons/fa';
import { Card, CardMedia, CardContent, Grid, Typography, TextField, Box, Button, Badge, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Avatar, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userEmail = localStorage.getItem('userEmail');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/food-items');
        setItems(response.data);
  
        const uniqueCategories = [...new Set(response.data.map(item => item.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
  
    fetchItems();
  }, []);  

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const sidebarItems = [
    { text: 'Home', icon: <FaHome />, link: '/home' },
    { text: 'Categories', icon: <FaThList />, link: '/categories' },
    { text: 'Dashboard', icon: <FaChartBar />, link: '/dashboard' },
    { text: 'Profile', icon: <FaUser />, link: '/profile' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f7' }}>
      {/* Permanent Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#1a1a2e',
            color: '#fff'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <img src="/images/logo.png" alt="Logo" style={{ width: 40, height: 40 }} />
          <Typography variant="h5" sx={{ ml: 2, fontWeight: 'bold', color: '#fff' }}>
            YOO!!!
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        <List>
          {sidebarItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              component={Link} 
              to={item.link}
              sx={{ 
                color: '#fff',
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderLeft: '4px solid #ff9800'
                },
                ...(window.location.pathname === item.link && {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderLeft: '4px solid #ff9800'
                })
              }}
            >
              <ListItemIcon sx={{ color: '#ff9800' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ marginTop: 'auto', padding: 2 }}>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleLogout}
            sx={{ 
              backgroundColor: '#ff9800',
              '&:hover': { backgroundColor: '#f57c00' }
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={toggleSidebar}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#1a1a2e',
            color: '#fff'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="/images/logo.png" alt="Logo" style={{ width: 40, height: 40 }} />
            <Typography variant="h5" sx={{ ml: 2, fontWeight: 'bold', color: '#fff' }}>
              YOO!!!
            </Typography>
          </Box>
          <IconButton onClick={toggleSidebar} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        <List>
          {sidebarItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              component={Link} 
              to={item.link}
              onClick={toggleSidebar}
              sx={{ 
                color: '#fff',
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderLeft: '4px solid #ff9800'
                },
                ...(window.location.pathname === item.link && {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderLeft: '4px solid #ff9800'
                })
              }}
            >
              <ListItemIcon sx={{ color: '#ff9800' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ marginTop: 'auto', padding: 2 }}>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleLogout}
            sx={{ 
              backgroundColor: '#ff9800',
              '&:hover': { backgroundColor: '#f57c00' }
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', padding: { xs: 2, md: 4 } }}>
        {/* Mobile Header */}
        <Box sx={{ 
          display: { xs: 'flex', md: 'none' }, 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 2,
          backgroundColor: '#fff',
          padding: 1,
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <IconButton onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Categories
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton sx={{ mr: 1 }}>
              <Badge badgeContent={cart.length} color="error">
                <FaShoppingCart />
              </Badge>
            </IconButton>
            <IconButton onClick={toggleUserMenu}>
              <Avatar sx={{ width: 30, height: 30, bgcolor: '#ff9800' }}>
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Box>

        {/* Page Title */}
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold', 
          marginBottom: 3, 
          display: { xs: 'none', md: 'block' },
          color: '#333'
        }}>
          Food Categories
        </Typography>

        {/* Search Bar */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: '#fff', 
          padding: 2, 
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: 3
        }}>
          <TextField
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for food items..."
            variant="outlined"
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: '#777' }} />
            }}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                '& fieldset': { border: 'none' }
              }
            }}
          />
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', ml: 2 }}>
            <IconButton>
              <Badge badgeContent={cart.length} color="error">
                <FaShoppingCart />
              </Badge>
            </IconButton>
            <IconButton sx={{ ml: 1 }}>
              <FaBell />
            </IconButton>
            <IconButton sx={{ ml: 1 }} onClick={toggleUserMenu}>
              <Avatar sx={{ bgcolor: '#ff9800' }}>
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Box>

        {/* Categories Chip List */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1,
          marginBottom: 3
        }}>
          <Button 
            variant={selectedCategory === '' ? 'contained' : 'outlined'}
            onClick={() => setSelectedCategory('')}
            sx={{ 
              borderRadius: 4,
              backgroundColor: selectedCategory === '' ? '#ff9800' : 'transparent',
              borderColor: '#ff9800',
              color: selectedCategory === '' ? '#fff' : '#ff9800',
              '&:hover': { 
                backgroundColor: selectedCategory === '' ? '#f57c00' : 'rgba(255,152,0,0.1)',
                borderColor: '#ff9800'
              }
            }}
          >
            All
          </Button>
          {categories.map((category, index) => (
            <Button 
              key={index} 
              variant={selectedCategory === category ? 'contained' : 'outlined'}
              onClick={() => handleCategoryChange(category)}
              sx={{ 
                borderRadius: 4,
                backgroundColor: selectedCategory === category ? '#ff9800' : 'transparent',
                borderColor: '#ff9800',
                color: selectedCategory === category ? '#fff' : '#ff9800',
                '&:hover': { 
                  backgroundColor: selectedCategory === category ? '#f57c00' : 'rgba(255,152,0,0.1)',
                  borderColor: '#ff9800'
                }
              }}
            >
              {category}
            </Button>
          ))}
        </Box>

        {/* Food Items Grid */}
        <Grid container spacing={3}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card sx={{ 
                borderRadius: 3, 
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { 
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }
              }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={item.image_url}
                  alt={item.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ padding: 2 }}>
                  <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {item.name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 1 }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      ${item.price}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => addToCart(item)}
                      sx={{ 
                        backgroundColor: '#ff9800',
                        '&:hover': { backgroundColor: '#f57c00' },
                        borderRadius: 8,
                        textTransform: 'none'
                      }}
                    >
                      Add <FaShoppingCart style={{ marginLeft: 5 }} />
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Footer */}
        {/* <Box sx={{ 
          marginTop: 5, 
          padding: 3, 
          textAlign: 'center',
          borderRadius: 2,
          backgroundColor: '#fff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="body2">© YOO!!! All Rights Reserved</Typography>
          <Typography variant="body2" sx={{ marginTop: 1 }}>🍴 YOO!!!</Typography>
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            Disclaimer: This site is only for ordering and learning to cook food.
          </Typography>
        </Box> */}
      </Box>
    </Box>
  );
};

export default CategoriesPage;
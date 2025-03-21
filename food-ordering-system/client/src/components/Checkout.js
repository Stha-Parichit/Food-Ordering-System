import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { 
  Button, TextField, Typography, Card, CardContent, Box, Grid, 
  Link, FormControl, Select, MenuItem, InputLabel, AppBar, Toolbar, 
  IconButton, Modal, Autocomplete, Menu, Divider, Badge, Avatar,
  Paper, List, ListItem, ListItemText, Container, CircularProgress
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Standard');
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const userEmail = localStorage.getItem("userEmail");
  const userId = localStorage.getItem("user_id");
  const [anchorEl, setAnchorEl] = useState(null);
  const apiUrl = "http://localhost:5000";

  useEffect(() => {
    document.title = "Checkout - YOO!!!";
    fetchCartItems();
    fetchUserPoints();
  }, []);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      if (!userId) {
        setError("Please log in to proceed with checkout");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${apiUrl}/cart`, {
        params: { user_id: userId }
      });
      
      if (response.data.success) {
        // Ensure items is always an array
        const items = Array.isArray(response.data.items) ? response.data.items : [];
        setCartItems(items);
        setError("");
      } else {
        setError(response.data.message || "Failed to load cart items");
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Unable to load your cart. Please try again later.");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPoints = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        const response = await axios.get("http://localhost:5000/loyalty-points", {
          params: { user_id: userId }
        });
        setUserPoints(response.data.points);
      } catch (error) {
        console.error("Error fetching user points:", error);
      }
    };

  const handleClickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

  const handleDiscountChange = (discount) => {
    if (selectedDiscount?.id === discount.id) {
      setSelectedDiscount(null);
      localStorage.removeItem("selectedDiscount");
    } else {
      setSelectedDiscount(discount);
      localStorage.setItem("selectedDiscount", JSON.stringify(discount));
    }
  };

  const handleCharityChange = (charity) => {
    if (selectedCharity?.id === charity.id) {
      setSelectedCharity(null);
      localStorage.removeItem("selectedCharity");
    } else {
      setSelectedCharity(charity);
      localStorage.setItem("selectedCharity", JSON.stringify(charity));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  const handleBackClick = () => {
    navigate('/cart');
  };

  // Fixed getSubtotal function that ensures cartItems is an array
  const getSubtotal = () => {
    return Array.isArray(cartItems) 
      ? cartItems.reduce((total, item) => total + (item.item_price * item.quantity), 0)
      : 0;
  };

  const discounts = [
    { id: 1, title: '5% discount', amount: '5 stamps', requiredPoints: 5 },
    { id: 2, title: '7% discount', amount: '8 stamps', requiredPoints: 8 },
    { id: 3, title: '8% discount', amount: '10 stamps', requiredPoints: 10 },
    { id: 4, title: '10% discount', amount: '12 stamps', requiredPoints: 12 },
    { id: 5, title: '15% discount', amount: '15 stamps', requiredPoints: 15 }
  ];

  const charityOptions = [
    { id: 1, title: 'Local food bank', amount: 'Rs. 500' },
    { id: 2, title: 'Hunger relief', amount: 'Rs. 1000' },
    { id: 3, title: 'Community Meals', amount: 'Rs. 1500' },
    { id: 4, title: 'Hunger relief', amount: 'Rs. 2000' }
  ];

  const subtotal = getSubtotal();
  const deliveryFee = 60;
  const charityDonation = selectedCharity ? parseInt(selectedCharity.amount.replace('Rs. ', '')) : 0;
  const discountPercentage = selectedDiscount ? parseInt(selectedDiscount.title) : 0;
  const discountAmount = (subtotal * discountPercentage / 100);
  const total = subtotal + deliveryFee + charityDonation - discountAmount;

  const handleCheckout = () => {
    if (!deliveryAddress) {
      alert("Please enter a delivery address");
      return;
    }
    
    localStorage.setItem("deliveryAddress", deliveryAddress);
    localStorage.setItem("paymentMethod", paymentMethod);
    
    if (paymentMethod === 'COD') {
      navigate('/order-confirmation');
    } else {
      setOpenModal(true);
    }
  };

  const handleConfirmPayment = () => {
    navigate('/e-pay');
  };

  // Static list of address options
  const addressOptions = [
    "123 Main St, Cityville, 12345",
    "456 Oak Rd, Townsville, 67890",
    "789 Pine Ln, Villagetown, 11223",
    "101 Maple Ave, Metropolis, 44556"
  ];

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      backgroundColor: "#f9f9f9" 
    }}>
      {/* Modern AppBar with consistent styling */}
      <AppBar position="sticky" sx={{ 
        backgroundColor: "#fff", 
        color: "#333", 
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)" 
      }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img 
              src="/images/logo.png" 
              alt="Logo" 
              style={{ width: 40, height: 40, cursor: 'pointer' }} 
              onClick={() => navigate("/home")}
            />
            <Typography 
              variant="h6" 
              sx={{ 
                ml: 2, 
                color: "#333", 
                fontWeight: "bold", 
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif"
              }}
              onClick={() => navigate("/home")}
            >
              YOO!!!
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mx: "auto" }}>
            <Button 
              sx={{ 
                color: "#333", 
                mx: 1,
                fontSize: "0.95rem",
                position: "relative",
                "&:hover": {
                  backgroundColor: "rgba(255,152,0,0.08)",
                },
                "&:after": {
                  content: "''",
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  width: 0,
                  height: "3px",
                  backgroundColor: "#ff9800",
                  transition: "width 0.3s, left 0.3s",
                },
                "&:hover:after": {
                  width: "70%",
                  left: "15%"
                }
              }} 
              component="a" 
              href="/home"
            >
              Home
            </Button>
            <Button 
              sx={{ 
                color: "#333", 
                mx: 1,
                fontSize: "0.95rem",
                position: "relative",
                "&:hover": {
                  backgroundColor: "rgba(255,152,0,0.08)",
                },
                "&:after": {
                  content: "''",
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  width: 0,
                  height: "3px",
                  backgroundColor: "#ff9800",
                  transition: "width 0.3s, left 0.3s",
                },
                "&:hover:after": {
                  width: "70%",
                  left: "15%"
                }
              }} 
              component="a" 
              href="/categories"
            >
              Categories
            </Button>
            <Button 
              sx={{ 
                color: "#333", 
                mx: 1,
                fontSize: "0.95rem",
                position: "relative",
                "&:hover": {
                  backgroundColor: "rgba(255,152,0,0.08)",
                },
                "&:after": {
                  content: "''",
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  width: 0,
                  height: "3px",
                  backgroundColor: "#ff9800",
                  transition: "width 0.3s, left 0.3s",
                },
                "&:hover:after": {
                  width: "70%",
                  left: "15%"
                }
              }} 
              component="a" 
              href="/dashboard"
            >
              Dashboard
            </Button>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField 
              variant="outlined" 
              size="small" 
              placeholder="Search" 
              InputProps={{ 
                endAdornment: <SearchIcon sx={{ color: "#ff9800" }} />,
                sx: { 
                  borderRadius: "20px",
                  height: "38px",
                  "& fieldset": {
                    borderColor: "rgba(0,0,0,0.08)"
                  },
                  "&:hover fieldset": {
                    borderColor: "#ff9800"
                  }
                }
              }} 
              sx={{ 
                bgcolor: "white", 
                mr: 2,
                width: "180px",
                transition: "all 0.3s ease",
                "&:hover": {
                  width: "200px"
                }
              }} 
            />
            <IconButton sx={{ mr: 1 }}>
              <Badge badgeContent={2} color="error" sx={{ "& .MuiBadge-badge": { backgroundColor: "#ff9800" } }}>
                <FaBell style={{ fontSize: "1.5rem", color: "#333" }} />
              </Badge>
            </IconButton>
            <IconButton onClick={handleClickProfile}>
              <Avatar sx={{ bgcolor: "#ff9800", width: 38, height: 38, boxShadow: "0 3px 5px rgba(255,152,0,0.2)" }}>
                {userEmail ? userEmail.charAt(0).toUpperCase() : <AccountCircleIcon />}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseProfileMenu}
              sx={{ 
                mt: 2,
                "& .MuiPaper-root": {
                  borderRadius: "10px",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
                }
              }}
            >
              <MenuItem sx={{ typography: 'subtitle2', fontWeight: "500", color: "#555" }}>{userEmail}</MenuItem>
              <Divider />
              <MenuItem component="a" href="/profile" sx={{ 
                "&:hover": { backgroundColor: "rgba(255,152,0,0.08)" } 
              }}>Profile</MenuItem>
              <MenuItem component="a" href="/orders" sx={{ 
                "&:hover": { backgroundColor: "rgba(255,152,0,0.08)" } 
              }}>My Orders</MenuItem>
              <MenuItem onClick={handleLogout} sx={{ 
                "&:hover": { backgroundColor: "rgba(255,152,0,0.08)" } 
              }}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 5, mb: 8, flex: 1 }}>
        {/* Modern breadcrumb-like navigation with back button */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          borderRadius: "8px",
          position: "relative"
        }}>
          <Button 
            variant="outlined" 
            onClick={handleBackClick} 
            startIcon={<span>◀</span>}
            sx={{ 
              mr: 2, 
              borderColor: "#ff9800", 
              color: "#ff9800", 
              fontWeight: "500",
              borderRadius: "20px",
              px: 3,
              "&:hover": { 
                borderColor: "#f57c00", 
                color: "#f57c00", 
                backgroundColor: "rgba(255,152,0,0.05)" 
              }
            }}
          >
            Back to Cart
          </Button>
          <Typography variant="h4" fontWeight="bold" sx={{ 
            background: "linear-gradient(90deg, #ff9800, #f57c00)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "'Poppins', sans-serif"
          }}>
            Checkout
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress color="primary" sx={{ color: "#ff9800" }} />
          </Box>
        ) : error ? (
          <Paper elevation={2} sx={{ 
            p: 4, 
            textAlign: "center",
            borderRadius: "12px", 
            boxShadow: "0 8px 16px rgba(0,0,0,0.05)"
          }}>
            <Typography variant="h6" color="error" mb={2}>
              {error}
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate("/cart")}
              sx={{ 
                mt: 2, 
                backgroundColor: '#ff9800',
                borderRadius: "20px",
                px: 3,
                fontWeight: "500",
                "&:hover": { backgroundColor: '#f57c00'} 
              }}
            >
              Return to Cart
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {/* Order Summary */}
              <Paper elevation={2} sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: "12px", 
                boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
                position: "relative",
                overflow: "hidden",
                "&:before": {
                  content: "''",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "4px",
                  height: "100%",
                  backgroundColor: "#ff9800"
                }
              }}>
                <Typography variant="h5" fontWeight="bold" mb={2} sx={{ 
                  display: "flex", 
                  alignItems: "center",
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  <ShoppingCartIcon sx={{ mr: 1, verticalAlign: 'middle', color: "#ff9800" }} />
                  Order Items ({cartItems.length})
                </Typography>
                
                {cartItems.length === 0 ? (
                  <Typography>Your cart is empty!</Typography>
                ) : (
                  <>
                    {cartItems.map(item => (
                      <Box 
                        key={item.cart_id} 
                        sx={{ 
                          p: 2, 
                          mb: 2, 
                          display: 'flex',
                          alignItems: 'center',
                          borderBottom: '1px solid #eee',
                          borderRadius: "8px",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: "rgba(255,152,0,0.03)",
                            transform: "translateX(4px)"
                          }
                        }}
                      >
                        <Box sx={{ 
                          width: 60, 
                          height: 60, 
                          mr: 2, 
                          borderRadius: "8px", 
                          overflow: 'hidden',
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                        }}>
                          <img 
                            src={item.image_url || '/images/placeholder-food.png'} 
                            alt={item.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight="500">
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Quantity: <span style={{ fontWeight: "500", color: "#ff9800" }}>{item.quantity}</span>
                          </Typography>
                        </Box>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#ff9800" }}>
                          Rs.{(item.item_price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </>
                )}
              </Paper>
              
              {/* Delivery Address */}
              <Paper elevation={2} sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: "12px", 
                boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
                position: "relative",
                overflow: "hidden",
                "&:before": {
                  content: "''",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "4px",
                  height: "100%",
                  backgroundColor: "#4caf50"
                }
              }}>
                <Typography variant="h5" fontWeight="bold" mb={2} sx={{ fontFamily: "'Poppins', sans-serif" }}>
                  📍 Delivery Address
                </Typography>
                <Autocomplete
                  value={deliveryAddress}
                  onChange={(event, newValue) => setDeliveryAddress(newValue)}
                  options={addressOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Delivery Address"
                      variant="outlined"
                      fullWidth
                      required
                      placeholder="Enter or select your delivery address"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          "&:hover fieldset": {
                            borderColor: "#4caf50"
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#4caf50"
                          }
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#4caf50"
                        }
                      }}
                    />
                  )}
                  freeSolo
                />
              </Paper>
              
              {/* Loyalty Discount */}
              <Paper elevation={2} sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: "12px", 
                boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
                position: "relative",
                overflow: "hidden",
                "&:before": {
                  content: "''",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "4px",
                  height: "100%",
                  backgroundColor: "#2196f3"
                }
              }}>
                <Typography variant="h5" fontWeight="bold" mb={1} sx={{ fontFamily: "'Poppins', sans-serif" }}>
                  💸 Loyalty Discount
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  You have{' '}
                  {userPoints === null ? (
                    <span style={{ color: 'red' }}>Error loading points</span>
                  ) : (
                    <Box component="span" sx={{ 
                      fontWeight: '600', 
                      color: '#ff9800',
                      backgroundColor: "rgba(255,152,0,0.1)",
                      px: 1,
                      py: 0.5,
                      borderRadius: "4px"
                    }}>
                      {userPoints} points
                    </Box>
                  )}
                </Typography>
                <Grid container spacing={2}>
                  {discounts.map(discount => (
                    <Grid item key={discount.id}>
                      <Button
                        variant={selectedDiscount?.id === discount.id ? "contained" : "outlined"}
                        onClick={() => handleDiscountChange(discount)}
                        disabled={userPoints < discount.requiredPoints}
                        sx={{ 
                          p: "10px 15px", 
                          borderRadius: "10px",
                          backgroundColor: selectedDiscount?.id === discount.id ? '#2196f3' : 'transparent',
                          borderColor: '#2196f3',
                          color: selectedDiscount?.id === discount.id ? 'white' : '#2196f3',
                          "&:hover": { 
                            backgroundColor: selectedDiscount?.id === discount.id ? '#1976d2' : 'rgba(33, 150, 243, 0.1)',
                            borderColor: '#1976d2'
                          },
                          transition: "transform 0.2s ease",
                          "&:active": {
                            transform: "scale(0.97)"
                          }
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body1" fontWeight="bold">
                            {discount.title}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {discount.amount}
                          </Typography>
                        </Box>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
              
              {/* Charity Donation */}
              <Paper elevation={2} sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: "12px", 
                boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
                position: "relative",
                overflow: "hidden",
                "&:before": {
                  content: "''",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "4px",
                  height: "100%",
                  backgroundColor: "#e91e63"
                }
              }}>
                <Typography variant="h5" fontWeight="bold" mb={2} sx={{ fontFamily: "'Poppins', sans-serif" }}>
                  💝 Charity Donation
                </Typography>
                <Grid container spacing={2}>
                  {charityOptions.map(charity => (
                    <Grid item key={charity.id}>
                      <Button
                        variant={selectedCharity?.id === charity.id ? "contained" : "outlined"}
                        onClick={() => handleCharityChange(charity)}
                        sx={{ 
                          p: "10px 15px", 
                          borderRadius: "10px",
                          backgroundColor: selectedCharity?.id === charity.id ? '#e91e63' : 'transparent',
                          borderColor: '#e91e63',
                          color: selectedCharity?.id === charity.id ? 'white' : '#e91e63',
                          "&:hover": { 
                            backgroundColor: selectedCharity?.id === charity.id ? '#d81b60' : 'rgba(233, 30, 99, 0.1)',
                            borderColor: '#d81b60'
                          },
                          transition: "transform 0.2s ease",
                          "&:active": {
                            transform: "scale(0.97)"
                          }
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body1" fontWeight="bold">
                            {charity.title}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {charity.amount}
                          </Typography>
                        </Box>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
              
              {/* Payment Method */}
              <Paper elevation={2} sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: "12px", 
                boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
                position: "relative",
                overflow: "hidden",
                "&:before": {
                  content: "''",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "4px",
                  height: "100%",
                  backgroundColor: "#9c27b0"
                }
              }}>
                <Typography variant="h5" fontWeight="bold" mb={2} sx={{ fontFamily: "'Poppins', sans-serif" }}>
                  💳 Payment Method
                </Typography>
                <FormControl fullWidth variant="outlined">
                  <InputLabel sx={{
                    "&.Mui-focused": {
                      color: "#9c27b0"
                    }
                  }}>Select Payment Method</InputLabel>
                  <Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    label="Select Payment Method"
                    sx={{
                      borderRadius: "10px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0,0,0,0.15)"
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#9c27b0"
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#9c27b0"
                      }
                    }}
                  >
                    <MenuItem value="Standard">Esewa</MenuItem>
                    <MenuItem value="COD">Cash On Delivery</MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ 
                p: 3, 
                borderRadius: "12px", 
                boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                position: "sticky", 
                top: 80,
                background: "linear-gradient(140deg, #ffffff, #fafafa)",
                border: "1px solid rgba(255,152,0,0.1)"
              }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ 
                  color: "#ff9800",
                  fontFamily: "'Poppins', sans-serif",
                  borderBottom: "2px solid rgba(255,152,0,0.2)",
                  pb: 1
                }}>
                  Order Summary
                </Typography>
                
                <List disablePadding>
                  <ListItem sx={{ 
                    py: 1, 
                    px: 0,
                    transition: "background-color 0.3s ease",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "rgba(255,152,0,0.03)"
                    }
                  }}>
                    <ListItemText primary={<Typography variant="body1" color="text.secondary">Subtotal</Typography>} />
                    <Typography variant="body1" fontWeight="500">Rs.{subtotal.toFixed(2)}</Typography>
                  </ListItem>
                  <ListItem sx={{ 
                    py: 1, 
                    px: 0,
                    transition: "background-color 0.3s ease",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "rgba(255,152,0,0.03)"
                    }
                  }}>
                    <ListItemText primary={<Typography variant="body1" color="text.secondary">Delivery Fee</Typography>} />
                    <Typography variant="body1" fontWeight="500">Rs.{deliveryFee.toFixed(2)}</Typography>
                  </ListItem>
                  {selectedCharity && (
                    <ListItem sx={{ 
                      py: 1, 
                      px: 0,
                      transition: "background-color 0.3s ease",
                      borderRadius: "8px",
                      "&:hover": {
                        backgroundColor: "rgba(255,152,0,0.03)"
                      }
                    }}>
                      <ListItemText 
                        primary={<Typography variant="body1" color="text.secondary">Charity Donation</Typography>}
                        secondary={
                          <Typography variant="caption" sx={{ 
                            backgroundColor: "rgba(233,30,99,0.1)", 
                            color: "#e91e63",
                            px: 1,
                            py: 0.3,
                            borderRadius: "4px",
                          }}
                          >
                            {selectedCharity.title}
                          </Typography>
                        }
                      />
                      <Typography variant="body1" fontWeight="500">Rs.{charityDonation.toFixed(2)}</Typography>
                    </ListItem>
                    )}
                    
                    {selectedDiscount && (
                      <ListItem sx={{ 
                        py: 1, 
                        px: 0,
                        transition: "background-color 0.3s ease",
                        borderRadius: "8px",
                        "&:hover": {
                          backgroundColor: "rgba(255,152,0,0.03)"
                        }
                      }}>
                        <ListItemText 
                          primary={<Typography variant="body1" color="text.secondary">Discount ({discountPercentage}%)</Typography>}
                          secondary={
                            <Typography variant="caption" sx={{ 
                              backgroundColor: "rgba(33,150,243,0.1)", 
                              color: "#2196f3",
                              px: 1,
                              py: 0.3,
                              borderRadius: "4px"
                            }}
                          >
                            {selectedDiscount.title}
                          </Typography>
                        }
                        />
                        <Typography variant="body1" fontWeight="500" sx={{ color: "#4caf50" }}>-Rs.{discountAmount.toFixed(2)}</Typography>
                      </ListItem>
                    )}
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <ListItem sx={{ 
                      py: 1.5, 
                      px: 0,
                      backgroundColor: "rgba(255,152,0,0.05)",
                      borderRadius: "8px",
                      mb: 2
                    }}>
                      <ListItemText primary={<Typography variant="subtitle1" fontWeight="bold">Total Amount</Typography>} />
                      <Typography variant="h6" fontWeight="bold" sx={{ color: "#ff9800" }}>
                        Rs.{total.toFixed(2)}
                      </Typography>
                    </ListItem>
                  </List>
                  
                  <Button 
                    variant="contained" 
                    fullWidth 
                    size="large" 
                    onClick={handleCheckout} 
                    sx={{ 
                      mt: 2, 
                      py: 1.5,
                      backgroundColor: "#ff9800",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "10px",
                      textTransform: "none",
                      fontSize: "1rem",
                      boxShadow: "0 8px 16px rgba(255,152,0,0.3)",
                      "&:hover": { 
                        backgroundColor: "#f57c00",
                        boxShadow: "0 12px 20px rgba(255,152,0,0.4)",
                      }
                    }}
                  >
                    Proceed to Payment
                  </Button>
                  
                  <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      By completing this order, you agree to our{' '}
                      <Link href="#" sx={{ color: "#ff9800" }}>Terms of Service</Link> and{' '}
                      <Link href="#" sx={{ color: "#ff9800" }}>Privacy Policy</Link>
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
          
          {/* Payment Confirmation Modal */}
          <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="payment-confirmation-modal"
          >
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: "16px",
              boxShadow: 24,
              p: 4,
            }}>
              <Typography id="payment-confirmation-modal" variant="h5" fontWeight="bold" sx={{ mb: 2, color: "#ff9800" }}>
                Confirm Payment
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                You are about to make a payment of <strong>Rs.{total.toFixed(2)}</strong> using {paymentMethod}.
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button 
                    onClick={() => setOpenModal(false)} 
                    fullWidth
                    variant="outlined"
                    sx={{ 
                      borderColor: "#ff9800", 
                      color: "#ff9800",
                      "&:hover": {
                        borderColor: "#f57c00",
                        color: "#f57c00",
                        backgroundColor: "rgba(255,152,0,0.05)"
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    onClick={handleConfirmPayment} 
                    variant="contained" 
                    fullWidth
                    sx={{ 
                      backgroundColor: "#ff9800",
                      "&:hover": { backgroundColor: "#f57c00" }
                    }}
                  >
                    Confirm
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>
        </Container>
        
        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: 'rgba(249, 249, 249, 0.8)',
            borderTop: '1px solid #eee',
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#ff9800" }}>
                  YOO!!!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Delivering happiness, one meal at a time. Your favorite food, delivered fast and fresh.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#333" }}>
                  Quick Links
                </Typography>
                <Link href="/home" color="inherit" display="block" sx={{ mb: 1, color: "text.secondary" }}>
                  Home
                </Link>
                <Link href="/categories" color="inherit" display="block" sx={{ mb: 1, color: "text.secondary" }}>
                  Categories
                </Link>
                <Link href="/about" color="inherit" display="block" sx={{ mb: 1, color: "text.secondary" }}>
                  About Us
                </Link>
                <Link href="/contact" color="inherit" display="block" sx={{ color: "text.secondary" }}>
                  Contact
                </Link>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#333" }}>
                  Contact Us
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  123 Food Street, Kathmandu
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  support@yoo.com
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  +977 9812345678
                </Typography>
              </Grid>
            </Grid>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
              © {new Date().getFullYear()} YOO!!! All rights reserved.
            </Typography>
          </Container>
        </Box>
      </div>
    );
  };
  
  export default Checkout;
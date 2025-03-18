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
      <AppBar position="sticky" sx={{ backgroundColor: "#fff", color: "#333", boxShadow: 2 }}>
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
              sx={{ ml: 2, color: "#333", fontWeight: "bold", cursor: 'pointer' }}
              onClick={() => navigate("/home")}
            >
              YOO!!!
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mx: "auto" }}>
            <Button sx={{ color: "#333", mx: 1 }} component="a" href="/home">
              Home
            </Button>
            <Button sx={{ color: "#333", mx: 1 }} component="a" href="/categories">
              Categories
            </Button>
            <Button sx={{ color: "#333", mx: 1 }} component="a" href="/dashboard">
              Dashboard
            </Button>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField 
              variant="outlined" 
              size="small" 
              placeholder="Search" 
              InputProps={{ endAdornment: <SearchIcon /> }} 
              sx={{ bgcolor: "white", borderRadius: 1, mr: 2 }} 
            />
            <IconButton sx={{ mr: 1 }}>
              <Badge badgeContent={2} color="error">
                <FaBell style={{ fontSize: "1.5rem", color: "#333" }} />
              </Badge>
            </IconButton>
            <IconButton onClick={handleClickProfile}>
              <Avatar sx={{ bgcolor: "#ff9800" }}>
                {userEmail ? userEmail.charAt(0).toUpperCase() : <AccountCircleIcon />}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseProfileMenu}
              sx={{ mt: 2 }}
            >
              <MenuItem sx={{ typography: 'subtitle2' }}>{userEmail}</MenuItem>
              <Divider />
              <MenuItem component="a" href="/profile">Profile</MenuItem>
              <MenuItem component="a" href="/orders">My Orders</MenuItem>
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 5, mb: 8, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button 
            variant="outlined" 
            onClick={handleBackClick} 
            sx={{ 
              mr: 2, 
              borderColor: "#ff9800", 
              color: "#ff9800", 
              fontWeight: "medium",
              "&:hover": { borderColor: "#f57c00", color: "#f57c00" }
            }}
          >
            ◀ Back to Cart
          </Button>
          <Typography variant="h4" fontWeight="bold">
            Checkout
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress color="primary" sx={{ color: "#ff9800" }} />
          </Box>
        ) : error ? (
          <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
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
              <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" mb={2}>
                  <ShoppingCartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
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
                          borderBottom: '1px solid #eee'
                        }}
                      >
                        <Box sx={{ width: 60, height: 60, mr: 2, borderRadius: 1, overflow: 'hidden' }}>
                          <img 
                            src={item.image_url || '/images/placeholder-food.png'} 
                            alt={item.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Quantity: {item.quantity}
                          </Typography>
                        </Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          ₹{(item.item_price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </>
                )}
              </Paper>
              
              {/* Delivery Address */}
              <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" mb={2}>
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
                    />
                  )}
                  freeSolo
                />
              </Paper>
              
              {/* Loyalty Discount */}
              <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" mb={1}>
                  💸 Loyalty Discount
                </Typography>
                <Typography variant="body1">
                  You have{' '}
                  {userPoints === null ? (
                    <span style={{ color: 'red' }}>Error loading points</span>
                  ) : (
                    <span style={{ fontWeight: 'bold', color: '#ff9800' }}>
                      {userPoints} points
                    </span>
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
                          borderRadius: 2,
                          backgroundColor: selectedDiscount?.id === discount.id ? '#ff9800' : 'transparent',
                          borderColor: '#ff9800',
                          color: selectedDiscount?.id === discount.id ? 'white' : '#ff9800',
                          "&:hover": { 
                            backgroundColor: selectedDiscount?.id === discount.id ? '#f57c00' : 'rgba(255, 152, 0, 0.1)',
                            borderColor: '#f57c00'
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
              <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" mb={2}>
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
                          borderRadius: 2,
                          backgroundColor: selectedCharity?.id === charity.id ? '#ff9800' : 'transparent',
                          borderColor: '#ff9800',
                          color: selectedCharity?.id === charity.id ? 'white' : '#ff9800',
                          "&:hover": { 
                            backgroundColor: selectedCharity?.id === charity.id ? '#f57c00' : 'rgba(255, 152, 0, 0.1)',
                            borderColor: '#f57c00'
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
              <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" mb={2}>
                  💳 Payment Method
                </Typography>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Select Payment Method</InputLabel>
                  <Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    label="Select Payment Method"
                  >
                    <MenuItem value="Standard">Esewa</MenuItem>
                    <MenuItem value="COD">Cash On Delivery</MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2, position: "sticky", top: 80 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Order Summary
                </Typography>
                
                <List disablePadding>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Subtotal" />
                    <Typography variant="body1">₹{subtotal.toFixed(2)}</Typography>
                  </ListItem>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Delivery Fee" />
                    <Typography variant="body1">₹{deliveryFee.toFixed(2)}</Typography>
                  </ListItem>
                  {selectedCharity && (
                    <ListItem sx={{ py: 1, px: 0 }}>
                      <ListItemText primary="Charity Donation" secondary={selectedCharity.title} />
                      <Typography variant="body1">₹{charityDonation.toFixed(2)}</Typography>
                    </ListItem>
                  )}
                  {selectedDiscount && (
                    <ListItem sx={{ py: 1, px: 0 }}>
                      <ListItemText 
                        primary="Loyalty Discount" 
                        secondary={`${selectedDiscount.title} (${selectedDiscount.amount})`} 
                      />
                      <Typography variant="body1" color="error">-₹{discountAmount.toFixed(2)}</Typography>
                    </ListItem>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary={<Typography variant="h6" fontWeight="bold">Total</Typography>} />
                    <Typography variant="h6" fontWeight="bold" color="#ff9800">
                      ₹{total.toFixed(2)}
                    </Typography>
                  </ListItem>
                </List>
                
                <Button 
                  variant="contained" 
                  fullWidth 
                  size="large"
                  disabled={cartItems.length === 0}
                  onClick={handleCheckout}
                  sx={{ 
                    mt: 3, 
                    backgroundColor: '#ff9800',
                    "&:hover": { backgroundColor: '#f57c00'},
                    height: 48,
                    fontWeight: "bold"
                  }}
                >
                  {paymentMethod === 'COD' ? 'Confirm Order' : 'Complete Payment'}
                </Button>
                
                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ 
                    mt: 2,
                    borderColor: '#ff9800',
                    color: '#ff9800',
                    "&:hover": { 
                      borderColor: '#f57c00',
                      color: '#f57c00',
                      backgroundColor: 'rgba(255, 152, 0, 0.1)'
                    }
                  }}
                  onClick={() => navigate("/home")}
                >
                  Continue Shopping
                </Button>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* Payment Confirmation Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="confirmation-modal"
      >
        <Box sx={{ 
          bgcolor: "white", 
          p: 4, 
          borderRadius: 2, 
          boxShadow: 3, 
          maxWidth: 400, 
          margin: "auto", 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)' 
        }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>Confirm Payment</Typography>
          <Typography variant="body1" mb={3}>
            Are you sure you want to proceed with the payment of ₹{total.toFixed(2)}?
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleConfirmPayment}
              sx={{ 
                backgroundColor: '#ff9800',
                "&:hover": { backgroundColor: '#f57c00'},
                mb: 2,
                height: 48
              }}
            >
              Yes, Proceed to Payment
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setOpenModal(false)}
              sx={{ 
                borderColor: '#ff9800',
                color: '#ff9800',
                "&:hover": { 
                  borderColor: '#f57c00',
                  color: '#f57c00',
                  backgroundColor: 'rgba(255, 152, 0, 0.1)'
                }
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Footer Section */}
      <Box sx={{ 
        textAlign: "center", 
        p: 4, 
        backgroundColor: "#f8f8f8", 
        borderTop: "1px solid #e0e0e0",
        mt: 'auto'
      }}>
        <Typography variant="body1" fontWeight="medium" mb={1}>© YOO!!! All Rights Reserved</Typography>
        <Typography variant="body2" color="text.secondary">
          🍴 Delicious food, delivered to your doorstep
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
          Disclaimer: This site is only for ordering and learning to cook food.
        </Typography>
      </Box>
    </div>
  );
};

export default Checkout;
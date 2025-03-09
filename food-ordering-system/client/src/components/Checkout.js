import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { Button, TextField, Typography, Card, CardContent, Box, Grid, Link, FormControl, Select, MenuItem, InputLabel, AppBar, Toolbar, IconButton, Modal, Autocomplete, Menu } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Standard');
  const [userPoints, setUserPoints] = useState(0);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const userEmail = localStorage.getItem("userEmail");
  const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "";
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        const response = await axios.get("http://localhost:5000/cart", {
          params: { user_id: userId }
        });
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
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

    fetchCartItems();
    fetchUserPoints();
  }, []);

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
    setSelectedCharity(charity);
    localStorage.setItem("selectedCharity", JSON.stringify(charity));
  };

  useEffect(() => {
    document.title = "Checkout - YOO!!!";
    const link = document.querySelector("link[rel*='icon']");
    link.href = "./images/logo.png";
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const handleBackClick = () => {
    navigate('/cart');
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
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

  const subtotal = getTotal();
  const deliveryFee = 60;
  const charityDonation = selectedCharity ? parseInt(selectedCharity.amount.replace('Rs. ', '')) : 0;
  const discountAmount = selectedDiscount ? (subtotal * parseInt(selectedDiscount.title) / 100) : 0;
  const total = subtotal + deliveryFee + charityDonation - discountAmount;

  const handleCheckout = () => {
    localStorage.setItem("deliveryAddress", deliveryAddress);
    localStorage.setItem("paymentMethod", paymentMethod); // Store payment method in local storage
    if (paymentMethod === 'COD') {
      navigate('/order-confirmation'); // Navigate to order confirmation page for COD
    } else {
      setOpenModal(true); // Show confirmation modal for other payment methods
    }
  };

  const handleConfirmPayment = () => {
    navigate('/payment');
  };

  const handleLogoClick = () => {
    navigate("/home");
  };

  // Static list of address options (you can replace this with your own list or API)
  const addressOptions = [
    "123 Main St, Cityville, 12345",
    "456 Oak Rd, Townsville, 67890",
    "789 Pine Ln, Villagetown, 11223",
    "101 Maple Ave, Metropolis, 44556"
  ];

  return (
    <div className="checkout-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="fixed" sx={{ backgroundColor: "#fff", color: "#333" }}>
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
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Button variant="outlined" onClick={handleBackClick} sx={{ margin: 2, marginTop:10, width:100, borderColor: "#333", color: "#333", fontWeight: "bold" }}>
        ◀ BACK
      </Button>

      <Card sx={{ margin: 2, padding: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>🛒 Your Order</Typography>
          {cartItems.length === 0 ? (
            <Typography>No items in your cart!</Typography>
          ) : (
            cartItems.map(item => (
              <Grid container key={item.cart_id} spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <Typography>{item.food_name} x{item.quantity}</Typography>
                </Grid>
                <Grid item xs={6} style={{ textAlign: 'right' }}>
                  <Typography>₹{item.price * item.quantity}</Typography>
                </Grid>
              </Grid>
            ))
          )}

          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>📍 Delivery</Typography>
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
                margin="normal"
                sx={{ marginBottom: 2 }}
              />
            )}
          />

          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>💸 Discount</Typography>
          <Typography variant="body2" sx={{ color: "#333", mb: 2 }}>You have {userPoints} points</Typography>
          <Grid container spacing={2}>
            {discounts.map(discount => (
              <Grid item key={discount.id}>
                <Button
                  variant="outlined"
                  color={selectedDiscount?.id === discount.id ? "primary" : "default"}
                  onClick={() => handleDiscountChange(discount)}
                  disabled={userPoints < discount.requiredPoints}
                  sx={{ padding: "10px 20px", fontWeight: "bold", borderRadius: 2 }}
                >
                  {discount.title}
                  <Typography variant="body2">{discount.amount}</Typography>
                </Button>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>💝 Charity Donation</Typography>
          <Grid container spacing={2}>
            {charityOptions.map(charity => (
              <Grid item key={charity.id}>
                <Button
                  variant="outlined"
                  color={selectedCharity?.id === charity.id ? "primary" : "default"}
                  onClick={() => handleCharityChange(charity)}
                  sx={{ padding: "10px 20px", fontWeight: "bold", borderRadius: 2 }}
                >
                  {charity.title}
                  <Typography variant="body2">{charity.amount}</Typography>
                </Button>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>💳 Payment Method</Typography>
          <FormControl fullWidth variant="outlined" margin="normal" sx={{ marginBottom: 2 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              label="Payment Method"
            >
              <MenuItem value="Standard">Esewa</MenuItem>
              <MenuItem value="COD">Cash On Delivery</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>Order Summary</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}><Typography>Subtotal:</Typography></Grid>
            <Grid item xs={6} style={{ textAlign: 'right' }}><Typography>Rs. {subtotal}</Typography></Grid>
            <Grid item xs={6}><Typography>Delivery Fee:</Typography></Grid>
            <Grid item xs={6} style={{ textAlign: 'right' }}><Typography>Rs. {deliveryFee}</Typography></Grid>
            <Grid item xs={6}><Typography>Charity Donation:</Typography></Grid>
            <Grid item xs={6} style={{ textAlign: 'right' }}><Typography>Rs. {charityDonation}</Typography></Grid>
            <Grid item xs={6}><Typography>Loyalty Discount:</Typography></Grid>
            <Grid item xs={6} style={{ textAlign: 'right' }}><Typography>-Rs. {discountAmount}</Typography></Grid>
            <Grid item xs={6}><Typography variant="h6">Total:</Typography></Grid>
            <Grid item xs={6} style={{ textAlign: 'right' }}><Typography variant="h6">Rs. {total}</Typography></Grid>
          </Grid>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCheckout}
            sx={{ marginTop: 2, backgroundColor: '#ff9800', "&:hover": { backgroundColor: '#f57c00'} }}
          >
            {paymentMethod === 'COD' ? 'Confirm Order' : 'Complete Payment'}
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="confirmation-modal"
        aria-describedby="confirmation-to-proceed-payment"
      >
        <Box sx={{ bgcolor: "white", p: 4, borderRadius: 2, boxShadow: 3, maxWidth: 400, margin: "auto", marginTop: "20%" }}>
          <Typography variant="h6">Are you sure you want to proceed with the payment?</Typography>
          <Box sx={{ marginTop: 2,  }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleConfirmPayment}
              sx={{ backgroundColor: '#ff9800',
                "&:hover": { backgroundColor: '#f57c00'} }}
            >
              Yes, Proceed
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => setOpenModal(false)}
              sx={{ marginTop: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

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

export default Checkout;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Link, Typography, Button, Container, Grid, Card, CardContent, CardMedia, IconButton, Box, Menu, MenuItem, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { FaBell } from "react-icons/fa";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const userEmail = localStorage.getItem("userEmail");
  const userId = localStorage.getItem("user_id"); // Retrieve user_id from local storage
  const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "";

  useEffect(() => {
    document.title = "Cart Page";
  }, []);

  useEffect(() => {
    if (!userId) {
      console.error("User ID is not available in local storage.");
      setErrorMessage("User ID is not available in local storage.");
      return;
    }

    console.log("User ID:", userId); // Debugging: Check if user_id is retrieved correctly

    const fetchCartItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/cart", {
          params: { user_id: userId }
        });
        console.log("API Response:", response.data); // Debugging: Check the API response
        if (response.data.length === 0) {
          setErrorMessage("Your cart is empty!");
        } else {
          setCartItems(response.data);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setErrorMessage("Error fetching cart items. Please try again later.");
      }
    };

    fetchCartItems();
  }, [userId]); // Add user_id as a dependency

  const removeFromCart = async (cartId) => {
    try {
      await axios.delete(`http://localhost:5000/cart/${cartId}`);
      setCartItems(cartItems.filter(item => item.cart_id !== cartId));
    } catch (error) {
      console.error("Error removing item from cart:", error);
      setErrorMessage("Error removing item from cart. Please try again later.");
    }
  };

  const updateQuantity = async (cartId, amount) => {
    const updatedCart = cartItems.map((item) => {
      if (item.cart_id === cartId) {
        item.quantity = Math.max(1, item.quantity + amount);
      }
      return item;
    });
    setCartItems(updatedCart);

    try {
      await axios.post("http://localhost:5000/cart", {
        food_id: updatedCart.find(item => item.cart_id === cartId).food_id,
        quantity: amount,
        user_id: userId
      });
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      setErrorMessage("Error updating cart item quantity. Please try again later.");
    }
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleClickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div>
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
              <MenuItem onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("userEmail"); localStorage.removeItem("user_id"); navigate("/login"); }}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" textAlign="center" mb={3}>
          Your Cart
        </Typography>
        {errorMessage && (
          <Typography variant="h6" color="error" textAlign="center" mb={3}>
            {errorMessage}
          </Typography>
        )}
        <Grid container spacing={3}>
          {cartItems.length === 0 && !errorMessage ? (
            <Typography variant="h6" textAlign="center" width="100%">
              Your cart is empty!
            </Typography>
          ) : (
            cartItems.map((item) => (
              <Grid item xs={12} md={6} key={item.cart_id}>
                <Card>
                  <CardMedia component="img" height="140" image={item.image_url} alt={item.food_name} />
                  <CardContent>
                    <Typography variant="h5">{item.food_name}</Typography>
                    <Typography variant="body1">Rs. {item.price}</Typography>
                    <Box display="flex" alignItems="center" mt={2}>
                      <Button variant="outlined" onClick={() => updateQuantity(item.cart_id, -1)}>-</Button>
                      <Typography variant="body1" mx={2}>{item.quantity}</Typography>
                      <Button variant="outlined" onClick={() => updateQuantity(item.cart_id, 1)}>+</Button>
                    </Box>
                    <Button variant="contained" color="secondary" onClick={() => removeFromCart(item.cart_id)} sx={{ mt: 2 }}>
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {cartItems.length > 0 && (
          <Box textAlign="center" mt={5}>
            <Typography variant="h5">Total: Rs. {getTotal()}</Typography>
            <Button variant="contained" color="primary" onClick={handleCheckout} sx={{ mt: 2, backgroundColor: '#ff9800',
                "&:hover": { backgroundColor: '#f57c00'} }}>
              Proceed to Checkout
            </Button>
          </Box>
        )}
      </Container>

      {/* Footer Section */}
      <Box sx={{ textAlign: "center", mt: 5, p: 3, backgroundColor: "#f0f0f0" }}>
        <Typography variant="body2">© YOO!!! All Rights Reserved</Typography>
        <Typography variant="body2">🍴 YOO!!!</Typography>
        <Typography variant="body2">
          Disclaimer: This site is only for ordering and learning to cook food.
        </Typography>
      </Box>
    </div>
  );
};

export default Cart;
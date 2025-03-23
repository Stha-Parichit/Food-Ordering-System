import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AppBar, Toolbar, Typography, Button, Container, Grid, Card, 
  CardContent, CardMedia, IconButton, Box, Menu, MenuItem, TextField,
  Divider, Paper, List, ListItem, ListItemText, Badge, Avatar,
  CircularProgress, Snackbar, Alert
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { FaBell } from "react-icons/fa";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const userEmail = localStorage.getItem("userEmail");
  const userId = localStorage.getItem("user_id");
  const apiUrl = "http://localhost:5000";

  useEffect(() => {
    document.title = "Your Cart | YOO!!!";
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      if (!userId) {
        setError("Please log in to view your cart");
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

  const removeFromCart = async (cartId) => {
    try {
      await axios.delete(`${apiUrl}/cart/${cartId}`);
      setCartItems(cartItems.filter(item => item.cart_id !== cartId));
      showNotification("Item removed from cart", "success");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      showNotification("Could not remove item from cart", "error");
    }
  };

  const updateQuantity = async (cartId, item, amount) => {
    // Don't allow quantity to go below 1
    if (item.quantity + amount < 1) return;
    
    try {
      // Update UI immediately for better UX
      const updatedCart = cartItems.map((cartItem) => {
        if (cartItem.cart_id === cartId) {
          return { ...cartItem, quantity: cartItem.quantity + amount };
        }
        return cartItem;
      });
      setCartItems(updatedCart);

      // Send update to backend
      await axios.put(`${apiUrl}/cart/${cartId}`, {
        quantity: item.quantity + amount
      });
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      // Revert to original state if API call fails
      fetchCartItems();
      showNotification("Failed to update quantity", "error");
    }
  };

  const getSubtotal = () => {
    return Array.isArray(cartItems) 
      ? cartItems.reduce((total, item) => total + (item.item_price * item.quantity), 0)
      : 0;
  };
  
  const getDeliveryFee = () => {
    return Array.isArray(cartItems) && cartItems.length > 0 ? 50 : 0;
  };
  
  const getTax = () => {
    return getSubtotal() * 0.13;
  };
  
  const getTotal = () => {
    return getSubtotal() + getDeliveryFee() + getTax();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showNotification("Your cart is empty", "warning");
      return;
    }
    navigate("/checkout");
  };

  const handleClickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleClearCart = async () => {
    if (cartItems.length === 0) return;
    
    try {
      await axios.delete(`${apiUrl}/cart`, { params: { user_id: userId } });
      setCartItems([]);
      showNotification("Cart cleared successfully", "success");
    } catch (error) {
      console.error("Error clearing cart:", error);
      showNotification("Failed to clear cart", "error");
    }
  };

  const formatCustomization = (item) => {
    if (!item.customization) return "";
    
    const customizations = [];
    const { 
      extraCheese, extraMeat, extraVeggies, noOnions, noGarlic, spicyLevel, 
      specialInstructions, glutenFree, cookingPreference, sides, dip_sauce 
    } = item.customization;
    
    if (extraCheese) customizations.push("Extra Cheese");
    if (extraMeat) customizations.push("Extra Meat");
    if (extraVeggies) customizations.push("Extra Veggies");
    if (noOnions) customizations.push("No Onions");
    if (noGarlic) customizations.push("No Garlic");
    if (glutenFree) customizations.push("Gluten-Free");
    if (cookingPreference) customizations.push(`Cooking Preference: ${cookingPreference}`);
    if (sides) customizations.push(`Sides: ${sides}`);
    if (dip_sauce) customizations.push(`Dip/Sauce: ${dip_sauce}`);
    if (spicyLevel && spicyLevel !== "Medium") customizations.push(`${spicyLevel} Spicy`);
    
    let result = customizations.join(", ");
    if (specialInstructions) {
      result += result ? `. Note: ${specialInstructions}` : `Note: ${specialInstructions}`;
    }
    
    return result;
  };

  return (
    <div>
      <AppBar position="sticky" sx={{ backgroundColor: "#fff", color: "#333", boxShadow: 2 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src="/images/logo.png" alt="Logo" style={{ width: 40, height: 40 }} />
            <Typography variant="h6" sx={{ ml: 2, color: "#333", fontWeight: "bold" }}>
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
            <IconButton>
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
              <MenuItem onClick={() => { 
                localStorage.removeItem("token"); 
                localStorage.removeItem("userEmail"); 
                localStorage.removeItem("user_id"); 
                navigate("/login"); 
              }}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3}>
          Your Cart
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="error" mb={2}>
              {error}
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate("/categories")}
              sx={{ 
                mt: 2, 
                backgroundColor: '#ff9800',
                "&:hover": { backgroundColor: '#f57c00'} 
              }}
            >
              Browse Menu
            </Button>
          </Paper>
        ) : cartItems.length === 0 ? (
          <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
            <ShoppingCartIcon sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
            <Typography variant="h5" mb={2}>Your cart is empty</Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Add delicious items to begin your order
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate("/categories")}
              sx={{ 
                mt: 2, 
                backgroundColor: '#ff9800',
                "&:hover": { backgroundColor: '#f57c00'} 
              }}
            >
              Browse Menu
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Items ({cartItems.length})</Typography>
                <Button 
                  variant="outlined" 
                  color="error" 
                  startIcon={<DeleteOutlineIcon />}
                  onClick={handleClearCart}
                  size="small"
                >
                  Clear All
                </Button>
              </Box>

              {cartItems.map((item) => (
                <Card key={item.cart_id} sx={{ mb: 2, display: 'flex', overflow: 'hidden' }}>
                  <CardMedia 
                    component="img" 
                    sx={{ width: 140, height: 140, objectFit: 'cover' }} 
                    image={item.image_url} 
                    alt={item.name} 
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <CardContent sx={{ flex: '1 0 auto', pb: 1 }}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6" component="div">
                          {item.name}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          Rs.{item.item_price}
                        </Typography>
                      </Box>
                      
                      {formatCustomization(item) && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                          {formatCustomization(item)}
                        </Typography>
                      )}
                      
                      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                        <Box display="flex" alignItems="center" border="1px solid #e0e0e0" borderRadius={1}>
                          <IconButton 
                            size="small" 
                            onClick={() => updateQuantity(item.cart_id, item, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography variant="body1" sx={{ mx: 2 }}>
                            {item.quantity}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => updateQuantity(item.cart_id, item, 1)}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        
                        <Typography variant="subtitle1" fontWeight="bold">
                          Rs.{(item.item_price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    </CardContent>
                    <Box display="flex" justifyContent="flex-end" p={1}>
                      <Button 
                        variant="text" 
                        color="error" 
                        startIcon={<DeleteOutlineIcon />}
                        onClick={() => removeFromCart(item.cart_id)}
                        size="small"
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, position: "sticky", top: 80 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Order Summary
                </Typography>
                
                <List disablePadding>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Subtotal" />
                    <Typography variant="body1">Rs.{getSubtotal().toFixed(2)}</Typography>
                  </ListItem>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Delivery Fee" />
                    <Typography variant="body1">Rs.{getDeliveryFee().toFixed(2)}</Typography>
                  </ListItem>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Tax (13%)" />
                    <Typography variant="body1">Rs.{getTax().toFixed(2)}</Typography>
                  </ListItem>
                  <Divider sx={{ my: 2 }} />
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary={<Typography variant="subtitle1" fontWeight="bold">Total</Typography>} />
                    <Typography variant="subtitle1" fontWeight="bold">
                      Rs.{getTotal().toFixed(2)}
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
                    height: 48
                  }}
                >
                  Proceed to Checkout
                </Button>
                
                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/categories")}
                >
                  Continue Shopping
                </Button>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>

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

      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Cart;
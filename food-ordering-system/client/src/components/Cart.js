import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AppBar, Toolbar, Typography, Button, Container, Grid, Card, 
  CardContent, CardMedia, IconButton, Box, Menu, MenuItem, TextField,
  Divider, Paper, List, ListItem, ListItemText, Badge, Avatar,
  CircularProgress, Snackbar, Alert, Chip, Collapse, Tooltip,
  useMediaQuery, useTheme, Drawer, ListItemIcon, Accordion, AccordionSummary, 
  AccordionDetails
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import EggAltIcon from "@mui/icons-material/EggAlt";
import BakeryDiningIcon from "@mui/icons-material/BakeryDining";
import SoupKitchenIcon from "@mui/icons-material/SoupKitchen";
import SetMealIcon from "@mui/icons-material/SetMeal";
import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";
import { FaBell } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

const Cart = () => {
  // State variables remain the same
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const userEmail = localStorage.getItem("userEmail");
  const userId = localStorage.getItem("user_id");
  const apiUrl = "http://localhost:5000";
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    document.title = "Your Cart | YOO!!!";
    fetchCartItems();
  }, []);

  // Helper function to toggle expanded state for item details
  const toggleItemDetails = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

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
      
      // Animate removal
      const updatedItems = cartItems.filter(item => item.cart_id !== cartId);
      setCartItems(updatedItems);
      
      showNotification("Item removed from cart", "success");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      showNotification("Could not remove item from cart", "error");
    }
  };

  const updateQuantity = async (cartId, item, amount) => {
    if (item.quantity + amount < 1) return;

    try {
      const updatedCart = cartItems.map((cartItem) => {
        if (cartItem.cart_id === cartId) {
          return { ...cartItem, quantity: cartItem.quantity + amount };
        }
        return cartItem;
      });
      setCartItems(updatedCart);

      await axios.put(`${apiUrl}/cart/${cartId}`, {
        quantity: item.quantity + amount
      });
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      showNotification(
        error.response?.data?.message || "Failed to update quantity. Please try again.",
        "error"
      );
      fetchCartItems(); // Revert to original state if API call fails
    }
  };

  // Financial calculations remain the same
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
    return getSubtotal() + getDeliveryFee() + getTax() - discount;
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

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("userEmail"); 
    localStorage.removeItem("user_id"); 
    navigate("/login");
  };

  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      showNotification("Please enter a promo code", "warning");
      return;
    }

    // Mock promo code logic
    if (promoCode.toUpperCase() === "WELCOME20") {
      const discountAmount = getSubtotal() * 0.2; // 20% discount
      setDiscount(discountAmount);
      setPromoApplied(true);
      showNotification("Promo code applied successfully! 20% off", "success");
    } else {
      showNotification("Invalid promo code", "error");
    }
  };

  // Enhanced customization display helpers
  const getCustomizationIcon = (type) => {
    switch(type) {
      case 'cooking':
        return <OutdoorGrillIcon fontSize="small" />;
      case 'sides':
        return <RestaurantMenuIcon fontSize="small" />;
      case 'dipping':
        return <SoupKitchenIcon fontSize="small" />;
      case 'spice':
        return <WhatshotIcon fontSize="small" />;
      case 'additions':
        return <AddIcon fontSize="small" />;
      case 'removals':
        return <RemoveIcon fontSize="small" />;
      case 'allergies':
        return <EggAltIcon fontSize="small" />;
      default:
        return <LocalDiningIcon fontSize="small" />;
    }
  };

  // Format cart item customizations for display
  const formatCustomizationSummary = (item) => {
    if (!item.customization) return [];
    
    const customizations = [];
    const { 
      extraCheese, extraMeat, extraVeggies, noOnions, noGarlic, spicyLevel, 
      glutenFree, cookingPreference, sides, dip_sauce 
    } = item.customization;
    
    // Add a more concise summary for the collapsed view
    if (extraCheese || extraMeat || extraVeggies) 
      customizations.push("Extra Add-ons");
    
    if (noOnions || noGarlic) 
      customizations.push("Special Prep");
    
    if (glutenFree) 
      customizations.push("Gluten-Free");
    
    if (cookingPreference) 
      customizations.push(cookingPreference);
    
    if (sides) 
      customizations.push(`Side: ${sides}`);
    
    if (dip_sauce) 
      customizations.push(`Sauce: ${dip_sauce}`);
    
    if (spicyLevel && spicyLevel !== "Medium") 
      customizations.push(`${spicyLevel} Spicy`);
    
    return customizations;
  };

  // Detailed breakdown of customizations by category
  const getDetailedCustomizations = (item) => {
    if (!item.customization) return {};
    
    const custom = item.customization;
    const result = {
      additions: [],
      removals: [],
      cookingPreference: custom.cookingPreference || null,
      sides: custom.sides || null,
      dip_sauce: custom.dip_sauce || null,
      spicyLevel: custom.spicyLevel || null,
      allergies: [],
      specialInstructions: custom.specialInstructions || null
    };
    
    // Additions
    if (custom.extraCheese) result.additions.push("Extra Cheese");
    if (custom.extraMeat) result.additions.push("Extra Meat");
    if (custom.extraVeggies) result.additions.push("Extra Veggies");
    
    // Removals
    if (custom.noOnions) result.removals.push("No Onions");
    if (custom.noGarlic) result.removals.push("No Garlic");
    
    // Allergies/Dietary
    if (custom.glutenFree) result.allergies.push("Gluten-Free");
    
    return result;
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: '#f9f9f9'
    }}>
      {/* App bar remains the same */}
      <AppBar position="sticky" elevation={0} sx={{ 
        backgroundColor: "#fff", 
        color: "#333", 
        borderBottom: '1px solid #eaeaea'
      }}>
        {/* AppBar content - same as before */}
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Toolbar content - same as before */}
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          ) : null}
          
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img 
              src="/images/logo.png" 
              alt="Logo" 
              style={{ 
                width: 40, 
                height: 40,
                filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.1))'
              }} 
            />
            <Typography 
              variant="h6" 
              sx={{ 
                ml: 2, 
                color: "#ff9800", 
                fontWeight: "bold",
                display: { xs: 'none', sm: 'block' }
              }}
            >
              YOO!!!
            </Typography>
          </Box>
          
          {!isMobile && (
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              backgroundColor: "#f5f5f5",
              borderRadius: "24px",
              padding: "4px 16px",
              width: '300px',
              mx: "auto"
            }}>
              <SearchIcon sx={{ color: '#757575', mr: 1 }} />
              <TextField 
                variant="standard"
                placeholder="Search for food" 
                fullWidth
                InputProps={{ 
                  disableUnderline: true,
                }}
                sx={{ '& input': { p: '8px 0' } }}
              />
            </Box>
          )}
          
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {!isMobile && (
              <>
                <Button 
                  sx={{ 
                    color: "#333", 
                    mx: 0.5,
                    borderRadius: '12px',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }} 
                  component="a" 
                  href="/home"
                  startIcon={<HomeIcon />}
                >
                  Home
                </Button>
                <Button 
                  sx={{ 
                    color: "#333", 
                    mx: 0.5,
                    borderRadius: '12px',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }} 
                  component="a" 
                  href="/categories"
                  startIcon={<CategoryIcon />}
                >
                  Menu
                </Button>
              </>
            )}
            
            <IconButton sx={{ ml: 1 }}>
              <Badge badgeContent={2} color="error">
                <FaBell style={{ fontSize: "1.3rem", color: "#333" }} />
              </Badge>
            </IconButton>
            
            <IconButton onClick={handleClickProfile} sx={{ ml: 1 }}>
              <Avatar sx={{ 
                bgcolor: "#ff9800",
                boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)'
              }}>
                {userEmail ? userEmail.charAt(0).toUpperCase() : <AccountCircleIcon />}
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseProfileMenu}
              PaperProps={{
                elevation: 3,
                sx: { 
                  mt: 1.5,
                  borderRadius: '12px',
                  minWidth: '200px',
                  overflow: 'visible',
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {/* Profile menu items - same as before */}
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: "#ff9800", mr: 2 }}>
                  {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 'bold' }}>{userEmail?.split('@')[0]}</Typography>
                  <Typography variant="body2" color="text.secondary">{userEmail}</Typography>
                </Box>
              </Box>
              <Divider />
              <MenuItem sx={{ py: 1.5 }} component="a" href="/profile">
                <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem sx={{ py: 1.5 }} component="a" href="/orders">
                <ListItemIcon><ReceiptIcon fontSize="small" /></ListItemIcon>
                My Orders
              </MenuItem>
              <Divider />
              <MenuItem sx={{ py: 1.5, color: 'error.main' }} onClick={handleLogout}>
                <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer - same as before */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': { 
            width: 280,
            borderRadius: '0 16px 16px 0',
          },
        }}
      >
        {/* Drawer content - same as before */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="/images/logo.png" alt="Logo" style={{ width: 36, height: 36 }} />
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold', color: '#ff9800' }}>
              YOO!!!
            </Typography>
          </Box>
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider />
        
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 1 }}>
            <Avatar sx={{ bgcolor: "#ff9800", mr: 2 }}>
              {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 'medium' }}>
                {userEmail?.split('@')[0] || 'Guest'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userEmail || 'Not signed in'}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <List>
          <ListItem button component="a" href="/home" onClick={toggleDrawer(false)}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component="a" href="/categories" onClick={toggleDrawer(false)}>
            <ListItemIcon><CategoryIcon /></ListItemIcon>
            <ListItemText primary="Menu" />
          </ListItem>
          <ListItem button component="a" href="/dashboard" onClick={toggleDrawer(false)}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component="a" href="/orders" onClick={toggleDrawer(false)}>
            <ListItemIcon><ReceiptIcon /></ListItemIcon>
            <ListItemText primary="My Orders" />
          </ListItem>
        </List>
        
        <Divider />
        
        <List>
          <ListItem button component="a" href="/profile" onClick={toggleDrawer(false)}>
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button onClick={() => { handleLogout(); toggleDrawer(false)(); }}>
            <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
          </ListItem>
        </List>
      </Drawer>

      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: 4, 
          mb: 8, 
          flex: 1,
          px: { xs: 2, md: 3 }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate("/categories")}
            sx={{ 
              mr: 2, 
              display: { xs: 'none', md: 'flex' },
              color: '#757575',
              borderRadius: '12px'
            }}
          >
            Back to Menu
          </Button>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            sx={{
              color: '#333',
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: { xs: 'calc(50% - 20px)', md: 0 },
                width: 40,
                height: 4,
                bgcolor: '#ff9800',
                borderRadius: 2,
              }
            }}
          >
            Your Cart
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress sx={{ color: '#ff9800' }} />
          </Box>
        ) : error ? (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              textAlign: "center", 
              borderRadius: '16px',
              border: '1px solid #eaeaea'
            }}
          >
            <Typography variant="h6" color="error" mb={2}>
              {error}
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate("/categories")}
              sx={{ 
                mt: 2, 
                backgroundColor: '#ff9800',
                "&:hover": { backgroundColor: '#f57c00'},
                borderRadius: '12px',
                boxShadow: '0 4px 14px rgba(255, 152, 0, 0.25)',
                px: 4,
                py: 1.5
              }}
            >
              Browse Menu
            </Button>
          </Paper>
        ) : cartItems.length === 0 ? (
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 3, md: 5 }, 
              textAlign: "center", 
              borderRadius: '16px',
              border: '1px solid #eaeaea'
            }}
          >
            <Box 
              component={motion.div}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ShoppingCartIcon sx={{ fontSize: 80, color: "#ff9800", mb: 2, opacity: 0.8 }} />
            </Box>
            <Typography variant="h5" mb={1} fontWeight="bold">Your cart is empty</Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Hungry? Add delicious items to begin your feast adventure!
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate("/categories")}
              sx={{ 
                backgroundColor: '#ff9800',
                "&:hover": { backgroundColor: '#f57c00'},
                borderRadius: '12px',
                boxShadow: '0 4px 14px rgba(255, 152, 0, 0.25)',
                px: 4,
                py: 1.5
              }}
            >
              Explore Menu
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box 
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Badge 
                    badgeContent={cartItems.length} 
                    color="primary"
                    sx={{ 
                      '& .MuiBadge-badge': { 
                        backgroundColor: '#ff9800',
                        fontWeight: 'bold'
                      }
                    }}
                  >
                    <ShoppingCartIcon sx={{ mr: 1, color: '#555' }} />
                  </Badge>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      ml: 1, 
                      fontWeight: 'medium',
                      color: '#333'
                    }}
                  >
                    Your Items
                  </Typography>
                </Box>
                
                <Button 
                  variant="text" 
                  color="error" 
                  startIcon={<DeleteOutlineIcon />}
                  onClick={handleClearCart}
                  disabled={cartItems.length === 0}
                  sx={{ 
                    borderRadius: '12px',
                    '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.08)' }
                  }}
                >
                  {isSmallScreen ? 'Clear' : 'Clear All'}
                </Button>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  mb: 3,
                  bgcolor: '#FFF8E1',
                  borderRadius: '12px',
                  border: '1px dashed #FFB74D'
                }}
              >
                <AccessTimeIcon sx={{ color: '#FF9800', mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Estimated Delivery Time
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    30-45 minutes from order confirmation
                  </Typography>
                </Box>
              </Box>

              {cartItems.map((item, index) => (
                <Box
                  component={motion.div}
                  key={item.cart_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Card 
                    sx={{ 
                      mb: 2, 
                      display: 'flex', 
                      flexDirection: 'column',
                      overflow: 'hidden',
                      borderRadius: '16px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      border: '1px solid #eaeaea',
                      bgcolor: 'white',
                      position: 'relative',
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                      <CardMedia 
                        component="img" 
                        sx={{ 
                          width: { xs: '100%', sm: 140 }, 
                          height: { xs: 140, sm: 140 }, 
                          objectFit: 'cover' 
                        }} 
                        image={item.image_url} 
                        alt={item.name} 
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <CardContent sx={{ flex: '1 0 auto', pb: 1 }}>
                          <Box display="flex" justifyContent="space-between" flexWrap="wrap">
                            <Typography 
                              variant="h6" 
                              component="div" 
                              sx={{ 
                                fontWeight: 'bold',
                                color: '#333'
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                color: '#ff9800',
                                fontWeight: 'bold'
                              }}
                            >
                              Rs.{item.item_price}
                            </Typography>
                          </Box>
                          
                          {formatCustomizationSummary(item).length > 0 && (
                            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {formatCustomizationSummary(item).map((customization, idx) => (
                                <Chip 
                                  key={idx} 
                                  label={customization} 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: '#f0f7ff', 
                                    color: '#0277bd', 
                                    fontWeight: 'medium',
                                    borderRadius: '8px',
                                    border: '1px solid #e3f2fd'
                                  }} 
                                  />
                                  ))}
                                  </Box>
                                  )}
                                  
                                  <Box sx={{ mt: 1 }}>
                                    <Tooltip title="Tap to see details" placement="top">
                                      <Typography 
                                        variant="body2" 
                                        color="text.secondary" 
                                        sx={{ 
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center'
                                        }}
                                        onClick={() => toggleItemDetails(item.cart_id)}
                                      >
                                        {expandedItems[item.cart_id] ? 'Hide details' : 'Show details'}
                                        <ExpandMoreIcon sx={{ 
                                          ml: 0.5, 
                                          fontSize: '1rem',
                                          transform: expandedItems[item.cart_id] ? 'rotate(180deg)' : 'rotate(0deg)',
                                          transition: 'transform 0.3s'
                                        }} />
                                      </Typography>
                                    </Tooltip>
                                  </Box>
                                  </CardContent>
                                  
                                  <CardContent sx={{ pt: 0 }}>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton 
                                          size="small" 
                                          onClick={() => updateQuantity(item.cart_id, item, -1)} 
                                          disabled={item.quantity <= 1}
                                          sx={{ 
                                            color: '#333',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                            p: 0.5
                                          }}
                                        >
                                          <RemoveIcon fontSize="small" />
                                        </IconButton>
                                        <Typography sx={{ mx: 1.5, fontWeight: 'medium' }}>
                                          {item.quantity}
                                        </Typography>
                                        <IconButton 
                                          size="small" 
                                          onClick={() => updateQuantity(item.cart_id, item, 1)}
                                          sx={{ 
                                            color: '#333',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                            p: 0.5
                                          }}
                                        >
                                          <AddIcon fontSize="small" />
                                        </IconButton>
                                      </Box>
                                      
                                      <IconButton 
                                        aria-label="remove" 
                                        onClick={() => removeFromCart(item.cart_id)}
                                        sx={{ 
                                          color: '#d32f2f',
                                          '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.08)' }
                                        }}
                                      >
                                        <DeleteOutlineIcon />
                                      </IconButton>
                                    </Box>
                                  </CardContent>
                                  </Box>
                                  </Box>
                                  
                                  <Collapse in={expandedItems[item.cart_id]} timeout="auto" unmountOnExit>
                                    <Divider sx={{ mx: 2 }} />
                                    <CardContent>
                                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                        Customizations
                                      </Typography>
                                      
                                      {/* Customization details */}
                                      <Grid container spacing={2} sx={{ mt: 0.5 }}>
                                        {Object.entries(getDetailedCustomizations(item)).map(([type, values]) => {
                                          // Skip empty arrays or null values
                                          if (!values || (Array.isArray(values) && values.length === 0)) return null;
                                          
                                          return (
                                            <Grid item xs={12} sm={6} key={type}>
                                              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                                <Box sx={{ 
                                                  mr: 1.5,
                                                  mt: 0.3,
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'center'
                                                }}>
                                                  {getCustomizationIcon(type)}
                                                </Box>
                                                <Box>
                                                  <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5, textTransform: 'capitalize' }}>
                                                    {type}
                                                  </Typography>
                                                  {Array.isArray(values) ? (
                                                    values.map((value, idx) => (
                                                      <Typography key={idx} variant="body2" color="text.secondary">
                                                        {value}
                                                      </Typography>
                                                    ))
                                                  ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                      {values}
                                                    </Typography>
                                                  )}
                                                </Box>
                                              </Box>
                                            </Grid>
                                          );
                                        })}
                                        
                                        {(!item.customization || Object.values(getDetailedCustomizations(item)).every(
                                          value => !value || (Array.isArray(value) && value.length === 0)
                                        )) && (
                                          <Grid item xs={12}>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                              No customizations added
                                            </Typography>
                                          </Grid>
                                        )}
                                      </Grid>
                                    </CardContent>
                                  </Collapse>
                                  </Card>
                                  </Box>
                                  ))}
                                  </Grid>
                                  
                                  <Grid item xs={12} md={4}>
                                    <Paper 
                                      elevation={0} 
                                      sx={{ 
                                        p: 3,
                                        borderRadius: '16px',
                                        border: '1px solid #eaeaea',
                                        position: 'sticky',
                                        top: '100px'
                                      }}
                                    >
                                      <Typography 
                                        variant="h6" 
                                        sx={{ 
                                          mb: 3,
                                          fontWeight: 'bold',
                                          color: '#333'
                                        }}
                                      >
                                        Order Summary
                                      </Typography>
                                  
                                      <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                          <Typography color="text.secondary">Subtotal</Typography>
                                          <Typography fontWeight="medium">Rs.{getSubtotal().toFixed(2)}</Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                          <Typography color="text.secondary">Delivery Fee</Typography>
                                          <Typography fontWeight="medium">Rs.{getDeliveryFee().toFixed(2)}</Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                          <Typography color="text.secondary">Tax (13%)</Typography>
                                          <Typography fontWeight="medium">Rs.{getTax().toFixed(2)}</Typography>
                                        </Box>
                                        
                                        {discount > 0 && (
                                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography color="error">Discount</Typography>
                                            <Typography fontWeight="medium" color="error">-Rs.{discount.toFixed(2)}</Typography>
                                          </Box>
                                        )}
                                        
                                        <Divider sx={{ my: 2 }} />
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                          <Typography variant="h6" fontWeight="bold">Total</Typography>
                                          <Typography variant="h6" fontWeight="bold" color="#ff9800">Rs.{getTotal().toFixed(2)}</Typography>
                                        </Box>
                                  
                                        {/* Promo Code Section */}
                                        <Box sx={{ mb: 3 }}>
                                          <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            mb: 1.5 
                                          }}>
                                            <LocalOfferIcon sx={{ color: '#ff9800', mr: 1, fontSize: '1.2rem' }} />
                                            <Typography variant="subtitle2" fontWeight="medium">Promo Code</Typography>
                                          </Box>
                                          
                                          <Box sx={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                          }}>
                                            <TextField
                                              fullWidth
                                              size="small"
                                              placeholder="Enter promo code"
                                              value={promoCode}
                                              onChange={(e) => setPromoCode(e.target.value)}
                                              disabled={promoApplied}
                                              InputProps={{
                                                sx: { borderRadius: '8px' }
                                              }}
                                            />
                                            <Button
                                              variant="outlined"
                                              size="small"
                                              onClick={applyPromoCode}
                                              disabled={promoApplied}
                                              sx={{ 
                                                borderRadius: '8px',
                                                whiteSpace: 'nowrap',
                                                color: '#ff9800',
                                                borderColor: '#ff9800',
                                                '&:hover': {
                                                  borderColor: '#f57c00',
                                                  backgroundColor: 'rgba(255, 152, 0, 0.04)'
                                                }
                                              }}
                                            >
                                              Apply
                                            </Button>
                                          </Box>
                                          
                                          {promoApplied && (
                                            <Box sx={{ 
                                              mt: 1.5, 
                                              display: 'flex', 
                                              alignItems: 'center',
                                              justifyContent: 'space-between',
                                              p: 1,
                                              bgcolor: '#FFF8E1',
                                              borderRadius: '8px',
                                              border: '1px solid #FFE082'
                                            }}>
                                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <LoyaltyIcon sx={{ color: '#FF9800', mr: 1, fontSize: '1rem' }} />
                                                <Typography variant="body2" fontWeight="medium">20% discount applied</Typography>
                                              </Box>
                                              <IconButton 
                                                size="small" 
                                                onClick={() => { 
                                                  setPromoApplied(false);
                                                  setDiscount(0);
                                                  setPromoCode('');
                                                }}
                                                sx={{ p: 0.5 }}
                                              >
                                                <CloseIcon fontSize="small" />
                                              </IconButton>
                                            </Box>
                                          )}
                                        </Box>
                                  
                                        <Button 
                                          variant="contained" 
                                          fullWidth 
                                          onClick={handleCheckout}
                                          sx={{ 
                                            py: 1.5,
                                            backgroundColor: '#ff9800',
                                            "&:hover": { backgroundColor: '#f57c00'},
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 14px rgba(255, 152, 0, 0.25)',
                                            fontWeight: 'bold',
                                            fontSize: '1rem'
                                          }}
                                        >
                                          Proceed to Checkout
                                        </Button>
                                        
                                        <Box sx={{ 
                                          mt: 2, 
                                          display: 'flex', 
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                        }}>
                                          <InfoOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'text.disabled' }} />
                                          <Typography variant="caption" color="text.disabled">
                                            Delivery times may vary during peak hours
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </Paper>
                                  </Grid>
                                  </Grid>
                                  )}
                                  
                                  <Snackbar
                                    open={notification.open}
                                    autoHideDuration={5000}
                                    onClose={handleCloseNotification}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                  >
                                    <Alert 
                                      onClose={handleCloseNotification} 
                                      severity={notification.severity}
                                      variant="filled"
                                      sx={{ width: '100%', borderRadius: '12px' }}
                                    >
                                      {notification.message}
                                    </Alert>
                                  </Snackbar>
                                  </Container>
                                  </Box>
                                  );
                                  };
                                  
                                  export default Cart;
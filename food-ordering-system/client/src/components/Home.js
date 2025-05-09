import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Rating,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Chip,
  useMediaQuery,
  useScrollTrigger,
  Slide,
  Fade,
  Skeleton,
  Snackbar,
  InputAdornment, ListItemIcon, Avatar, 
  Autocomplete, TextField
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Badge from '@mui/material/Badge';

import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { motion } from "framer-motion";
import axios from "axios";
import CustomizeOrderPopup from "./CustomizeOrderPopup";


// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.16)',
  },
  position: 'relative',
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 220,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '30%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
  },
}));

const PriceTag = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: alpha(theme.palette.primary.main, 0.9),
  color: theme.palette.primary.contrastText,
  padding: '4px 12px',
  borderRadius: 20,
  fontWeight: 'bold',
  zIndex: 2,
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  left: 16,
  zIndex: 2,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 28,
  padding: '10px 24px',
  fontWeight: 600,
  textTransform: 'none',
  transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 1)',
  },
}));

const SearchBar = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 24,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  border: '1px solid',
  borderColor: alpha(theme.palette.common.black, 0.1),
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(theme.palette.common.black, 0.5),
}));

const StyledInputBase = styled('input')(({ theme }) => ({
  color: theme.palette.text.primary,
  padding: theme.spacing(1, 1, 1, 0),
  // vertical padding + font size from searchIcon
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  transition: theme.transitions.create('width'),
  width: '100%',
  height: 40,
  [theme.breakpoints.up('md')]: {
    width: '30ch',
  },
  border: 'none',
  outline: 'none',
  background: 'transparent',
}));

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: theme.spacing(10, 0),
  color: theme.palette.common.white,
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.spacing(0, 0, 4, 4),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(6),
}));

const FeatureBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  borderRadius: 16,
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },
}));

const CircleIcon = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  borderRadius: '50%',
  width: 60,
  height: 60,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));


// Hidden AppBar on scroll
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Home = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const userEmail = localStorage.getItem("userEmail");

  
  
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'));

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("user_id");
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [navigate]);

  // Sample categories and prices for demo
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'];
  const prices = ['$8.99', '$12.99', '$15.99', '$7.50', '$9.99', '$14.50'];

  const [selectedItem, setSelectedItem] = useState(null);
  const [openCustomizePopup, setOpenCustomizePopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [openPopup, setOpenPopup] = useState(false);

  /// Add to Cart with customization
  const handleAddToCart = (item) => {
    setSelectedItem(item); // Set the selected item
    setOpenCustomizePopup(true); // Open the customization popup
  };

// Handle customization save
const handleSaveCustomization = async (item, customization) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      // Handle case where user is not logged in
      alert("Please log in to add items to your cart");
      navigate("/login");
      return;
    }

    // Show loading indicator
    setLoading(true);

    const sidesValue = customization.sides
      ? customization.sides.map(side => `${side.label} × ${side.quantity}`).join(", ")
      : null;

    const dipSauceValue = customization.dip_sauce
      ? customization.dip_sauce.map(dip => `${dip.label} × ${dip.quantity}`).join(", ")
      : null;

      // Calculate the total price
    let totalPrice = parseFloat(item.price) || 0; // Base price
    if (customization.sides) {
      totalPrice += customization.sides.reduce((sum, side) => sum + (side.price * side.quantity), 0);
    }
    if (customization.dip_sauce) {
      totalPrice += customization.dip_sauce.reduce((sum, dip) => sum + (dip.price * dip.quantity), 0);
    }
    if (customization.extraCheese) totalPrice += 1.5; // Example price for extra cheese
    if (customization.extraMeat) totalPrice += 2.0; // Example price for extra meat
    if (customization.extraVeggies) totalPrice += 1.0; // Example price for extra veggies

      const response = await axios.post("http://localhost:5000/cart", {
        food_id: item.id,
        user_id: userId,
        quantity: customization.quantity || 1,
        total_price: totalPrice * (customization.quantity || 1), // Send total price
        extraCheese: customization.extraCheese || false,
        extraMeat: customization.extraMeat || false,
        extraVeggies: customization.extraVeggies || false,
        noOnions: customization.noOnions || false,
        noGarlic: customization.noGarlic || false,
        spicyLevel: customization.spicyLevel || 'Medium',
        specialInstructions: customization.specialInstructions || "",
        glutenFree: customization.glutenFree || false,
        cookingPreference: customization.cookingPreference || null,
        sides: sidesValue, // Pass as a human-readable string
        dip_sauce: dipSauceValue // Pass as a human-readable string
      });

    if (response.data.success) {
      // Update local cart for UI (optional, you could also re-fetch cart items)
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItemIndex = cart.findIndex(cartItem => 
        cartItem.id === item.id && 
        cartItem.customization && 
        cartItem.customization.extraCheese === customization.extraCheese &&
        cartItem.customization.extraMeat === customization.extraMeat &&
        cartItem.customization.noOnions === customization.noOnions &&
        cartItem.customization.glutenFree === customization.glutenFree && // New field
        cartItem.customization.cookingPreference === customization.cookingPreference && // New field
        cartItem.customization.dip_sauce === customization.dip_sauce // New field
      );

      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += customization.quantity;
      } else {
        cart.push({ 
          ...item, 
          quantity: customization.quantity,
          customization: { 
            extraCheese: customization.extraCheese,
            extraMeat: customization.extraMeat,
            extraVeggies: customization.extraVeggies,
            noOnions: customization.noOnions,
            noGarlic: customization.noGarlic,
            spicyLevel: customization.spicyLevel,
            specialInstructions: customization.specialInstructions,
            glutenFree: customization.glutenFree, // New field
            cookingPreference: customization.cookingPreference, // New field
            dip_sauce: customization.dip_sauce // New field
          }
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      // Show success message
      let customizationDetails = [];
if (customization.extraCheese) customizationDetails.push("Extra Cheese");
if (customization.extraMeat) customizationDetails.push("Extra Meat");
if (customization.extraVeggies) customizationDetails.push("Extra Veggies");
if (customization.noOnions) customizationDetails.push("No Onions");
if (customization.noGarlic) customizationDetails.push("No Garlic");
if (customization.glutenFree) customizationDetails.push("Gluten-Free"); // New field
if (customization.cookingPreference) customizationDetails.push(`Cooking Preference: ${customization.cookingPreference}`); // New field
if (customization.dip_sauce && customization.dip_sauce.length > 0) {
  const dipSauceDetails = customization.dip_sauce.map(dip => `${dip.label} × ${dip.quantity}`).join(", ");
  customizationDetails.push(`Dip/Sauce: ${dipSauceDetails}`);
}
if (customization.sides && customization.sides.length > 0) {
  const sidesDetails = customization.sides.map(side => `${side.label} × ${side.quantity}`).join(", ");
  customizationDetails.push(`Sides: ${sidesDetails}`);
}if (customization.spicyLevel !== 'Medium') customizationDetails.push(`${customization.spicyLevel} Spice`);

let messageDetails = customizationDetails.length > 0 
  ? ` with ${customizationDetails.join(", ")}`
  : "";

setPopupMessage(`${item.name} × ${customization.quantity} added to cart${messageDetails}!`);
      setOpenPopup(true);
    } else {
      console.error("Failed to add item to cart:", response.data.message);
      alert("Failed to add item to cart. Please try again.");
    }
  } catch (error) {
    console.error("Error adding customized order:", error);
    alert("An error occurred. Please try again.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/food-items");
        const data = await response.json();
        
        // Add sample prices and categories for the demo
        const enhancedData = data.map((item, index) => ({
          ...item,
          price: parseFloat(item.price) || 0, // Ensure price is a valid number
          category: item.category,
          preparationTime: Math.floor(Math.random() * 30) + 15 + ' min', // Random prep time between 15-45 min
        }));
        
        setTimeout(() => {
          setFoodItems(enhancedData);
          setLoading(false);
        }, 1000); // Simulate loading for the demo
      } catch (error) {
        console.error("Error fetching food items:", error);
        setLoading(false);
        
        // Fallback data in case API fails
        const fallbackData = Array(6).fill().map((_, i) => ({
          name: `Delicious Food ${i+1}`,
          description: "A mouth-watering dish that will satisfy your cravings.",
          image_url: "/images/default-placeholder.png",
          rating: Math.floor(Math.random() * 2) + 3 + Math.random(),
          price: parseFloat(prices[i % prices.length]), // Ensure fallback price is a number
          category: categories[i % categories.length],
          preparationTime: Math.floor(Math.random() * 30) + 15 + ' min',
        }));
        setFoodItems(fallbackData);
      }
    };

    fetchFoodItems();
  }, []);

  useEffect(() => {
    // Fetch search options (e.g., food item names)
    const fetchSearchOptions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/food-items");
        const options = response.data.map(item => item.name);
        setSearchOptions(options);
      } catch (error) {
        console.error("Error fetching search options:", error);
      }
    };
    fetchSearchOptions();
  }, []);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
    console.log("Cart Count:", totalItems); // Debugging cart count
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;
  
        const response = await axios.get(`http://localhost:5000/cart?user_id=${userId}`);
        if (response.data.success && response.data.items) {
          // Count unique items in the cart
          setCartCount(response.data.items.length);
        } else {
          setCartCount(0); // Fallback to 0 if no items
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
        setCartCount(0); // Fallback to 0 on error
      }
    };
  
    fetchCartCount();
  }, []);

  // const handleAddToCart = () => {
  //   setOpenDialog(true);
  // };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = (item, customization) => {
    handleSaveCustomization(item, customization); // Call the existing save logic
    setOpenCustomizePopup(false); // Close the popup after saving
  };

  const handleLoginRedirect = () => {
    navigate("/login");
    setOpenDialog(false);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen); // Toggle the drawerOpen state
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id"); // Remove logged-in status
    navigate("/"); // Redirect to the landing page
  };

  const drawer = (
    <Box sx={{ width: 250, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          YOO!!!
        </Typography>
        <img src="./images/logo1.png" onClick={handleDrawerToggle} alt="Logo" style={{ width: 36, height: 36, borderRadius: "30px" }} > 
          <CloseIcon />
        </img>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List>
        {['Home', 'Dashboard', 'About Us', 'Contact'].map((text) => (
          <ListItem button key={text} sx={{ borderRadius: 2, mb: 1 }}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="outlined" color="primary" fullWidth>
          Login
        </Button>
        <Button variant="contained" color="primary" fullWidth>
          Register
        </Button>
      </Box>
    </Box>
  );

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleProtectedNavigation = (path) => {
    const isLoggedIn = localStorage.getItem("user_id");
    if (!isLoggedIn) {
      setOpenDialog(true);
    } else {
      navigate(path);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          sx={{ 
            backgroundColor: "rgba(255, 255, 255, 0.9)", 
            backdropFilter: "blur(10px)",
            color: "#333", 
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img src="/images/logo1.png" alt="Logo" style={{ width: 50, height: 45,}} />
                {/* <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 800, 
                    background: "linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mr: 1
                  }}
                >
                  YOO!!!
                </Typography> */}
                
              </Box>
            </Box>
            
            {!isMobile && (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Button 
                    sx={{ 
                      color: "#333", 
                      fontWeight: 500, 
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'transform 0.2s'
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
                      fontWeight: 500, 
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'transform 0.2s'
                    }} 
                    component="a" 
                    href="/view-tutorials"
                    startIcon={<CategoryIcon />}
                  >
                    View Tutorials
                  </Button>
                  <Button 
                    sx={{ 
                      color: "#333", 
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'transform 0.2s'
                    }} 
                    component="a" 
                    href="/dashboard"
                    startIcon={<DashboardIcon />}
                  >
                    Dashboard
                  </Button>
                  
                </Box>
                
                {/* <Box sx={{ display: "flex", justifyContent:"center" ,alignItems: "center", mb: 3, ml: 2, transform: "translateY(10px)" }}>
                  <Autocomplete
                    freeSolo
                    options={searchQuery.length > 0 ? searchOptions.filter(option => 
                      option.toLowerCase().includes(searchQuery.toLowerCase())
                    ) : []}
                    inputValue={searchQuery}
                    onInputChange={(event, value) => setSearchQuery(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Search for food items..."
                        variant="outlined"
                        size="small"
                        sx={{
                          width: "300px",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 24,
                            backgroundColor: "white",
                          },
                        }}
                      />
                    )}
                  />
                </Box> */}
              </>
            )}
            
            <Box sx={{ display: "flex", alignItems: "center" }}>
            {!isMobile && (
  <>
    <Button 
      variant="text"
      startIcon={
        <Badge badgeContent={cartCount} color="error">
          <ShoppingCartIcon />
        </Badge>
      }
      sx={{ 
        mr: 1,
        color: "#333",
        fontWeight: 500,
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
      }}
      href="/cart"
    >
      Cart
    </Button>
    <Button 
      variant="outlined" 
      sx={{ 
        mr: 1,
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: 600,
        borderColor: '#FF6B6B',
        color: '#FF6B6B',
        '&:hover': {
          borderColor: '#FF8E53',
          backgroundColor: 'rgba(255, 107, 107, 0.04)',
        },
      }}
      component="a" 
      href="/profile"
    >
      My Profile
    </Button>
    <StyledButton 
      variant="contained" 
      sx={{ 
        background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
        color: 'white',
      }}
      onClick={handleLogout} // Updated to use handleLogout
    >
      Logout
    </StyledButton>
  </>
)}
              {isMobile && (
                <IconButton 
                  color="inherit" 
                  onClick={() => navigate("/cart")} 
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              )}
              {/* <IconButton onClick={handleDrawerToggle}>
                <Avatar sx={{ bgcolor: "#ff9800" }}>
                  {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
                </Avatar>
              </IconButton> */}
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      
      {/* Mobile Drawer */}
      {isMobile && (
  <>
    <IconButton
      color="inherit"
      aria-label="open drawer"
      edge="start"
      onClick={handleDrawerToggle}
      sx={{ mr: 2 }}
    >
      <MenuIcon />
    </IconButton>
    <Drawer
        anchor="left"
        open={drawerOpen} // Use the drawerOpen state to control visibility
        onClose={toggleDrawer(false)} // Close the drawer when clicking outside
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
            <img src="/images/logo1.png" alt="Logo" style={{ width: 50, height: 45 }} />
            {/* <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold', color: '#ff9800' }}>
              YOO!!!
            </Typography> */}
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
  </>
)}
      
      {/* Toolbar spacer */}
      <Toolbar />
      
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={true} timeout={1000}>
                <Box>
                  <Typography 
                    variant="h2" 
                    fontWeight="800" 
                    sx={{ 
                      mb: 2,
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                  >
                    Delicious Food,{' '}
                    <Box component="span" sx={{ 
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '100%',
                        height: '30%',
                        bottom: 0,
                        left: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        zIndex: -1,
                      }
                    }}>
                      Delivered
                    </Box>
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 3, 
                      opacity: 0.9,
                      maxWidth: 500,
                      fontSize: { xs: '1.2rem', md: '1.5rem' }
                    }}
                  >
                    Discover amazing recipes and get food delivered to your doorstep in minutes.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <StyledButton 
                      variant="contained" 
                      size="large" 
                      sx={{ 
                        background: 'white',
                        color: '#FF6B6B',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem'
                      }}
                      endIcon={<ArrowForwardIcon />}
                      component="a"
                      href="/categories"
                    >
                      Start Ordering
                    </StyledButton>
                    <StyledButton 
                      variant="outlined" 
                      size="large" 
                      sx={{ 
                        borderColor: 'white', 
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem'
                      }}
                      component="a"
                      href="/categories"
                    >
                      View Menu
                    </StyledButton>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 4, gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StarIcon sx={{ mr: 1, color: '#FFD700' }} />
                      <Box>
                        <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: 600 }}>4.9</Typography>
                        <Typography variant="caption">Rating</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DeliveryDiningIcon sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: 600 }}>15k+</Typography>
                        <Typography variant="caption">Deliveries</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FastfoodIcon sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: 600 }}>100+</Typography>
                        <Typography variant="caption">Food Items</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box 
                sx={{ 
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    top: '-50px',
                    right: '-50px',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    bottom: '-30px',
                    left: '50px',
                  }
                }}
              >
                <img 
                  src="./images/delivery.jpg"
                  alt="Food delivery" 
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    transform: 'perspective(1000px) rotateY(-5deg)',
                  }} 
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>
      
      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography 
          variant="h4" 
          textAlign="center" 
          mb={1}
          fontWeight="bold"
        >
          Why Choose YOO!!!
        </Typography>
        <Typography 
          variant="body1" 
          textAlign="center" 
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}
        >
          We make food ordering and delivery a piece of cake. Here's why thousands of customers love our service.
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureBox>
              <CircleIcon>
                <FastfoodIcon fontSize="large" />
              </CircleIcon>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Quality Ingredients
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We source only the freshest, high-quality ingredients to ensure every dish is delicious.
              </Typography>
            </FeatureBox>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureBox>
              <CircleIcon>
                <DeliveryDiningIcon fontSize="large" />
              </CircleIcon>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Fast Delivery
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our delivery partners ensure your food arrives quickly and in perfect condition.
              </Typography>
            </FeatureBox>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureBox>
              <CircleIcon>
                <AccessTimeIcon fontSize="large" />
              </CircleIcon>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Easy Ordering
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our intuitive platform makes ordering food online simple and hassle-free.
              </Typography>
            </FeatureBox>
          </Grid>
        </Grid>
      </Container>

      {/* Popular Recipes Section */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography 
              variant="h4" 
              fontWeight="bold"
            >
              Popular Recipes
            </Typography>
            <Button 
              variant="text" 
              color="primary" 
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              View All
            </Button>
          </Box>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {loading ? (
                // Skeleton loading state
                Array.from(new Array(6)).map((_, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    <Card sx={{ borderRadius: 4, overflow: 'hidden', height: '100%' }}>
                      <Skeleton variant="rectangular" height={220} />
                      <CardContent>
                        <Skeleton variant="text" height={30} width="80%" />
                        <Skeleton variant="text" height={20} width="40%" />
                        <Skeleton variant="text" height={60} />
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                          <Skeleton variant="rectangular" height={40} width="48%" />
                          <Skeleton variant="rectangular" height={40} width="48%" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                foodItems.map((item, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    <motion.div variants={itemVariants}>
                      <StyledCard>
                        <PriceTag>{`Rs. ${Number(item.price || 0).toFixed(2)}`}</PriceTag>
                        <CategoryChip 
                          label={item.category} 
                          size="small"
                          color={index % 3 === 0 ? "primary" : index % 3 === 1 ? "secondary" : "default"}
                        />
                        <StyledCardMedia
                          component="img"
                          image={item.image_url || `/api/placeholder/${300 + index}/${400 + index}?text=Food${index + 1}`}
                          alt={item.name}
                        />
                        <CardContent sx={{ position: 'relative', zIndex: 1, pt: 2 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                            <Typography variant="h6" fontWeight="bold">{item.name}</Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Rating
                                name="rating"
                                value={item.rating || 0}
                                precision={0.5}
                                readOnly
                                size="small"
                              />
                              <Typography variant="body2" sx={{ ml: 0.5 }}>
                                {item.rating ? item.rating.toFixed(1) : "0.0"}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden' }}>
                            {item.description || "A delicious recipe with fresh ingredients, perfect for any occasion."}
                          </Typography>

                          
                          
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              {item.preparationTime || "30 min"}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button 
                              variant="outlined"
                              color="primary"
                              sx={{ 
                                flex: 1, 
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600
                              }}
                              href={`/food/${item.id}`}
                            >
                              Details
                            </Button>
                            <Button 
                              variant="contained"
                              sx={{ 
                                flex: 1, 
                                borderRadius: 2,
                                background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                                textTransform: 'none',
                                fontWeight: 600
                              }}
                              onClick={() => handleAddToCart(item)}
                            >
                              Add to Cart
                            </Button>
                            {selectedItem && (
  <CustomizeOrderPopup
    open={openCustomizePopup}
    onClose={() => setOpenCustomizePopup(false)}
    onSave={handleSave} // Pass handleSave here
    item={selectedItem}
  />
)}
                          </Box>
                        </CardContent>
                      </StyledCard>
                    </motion.div>
                  </Grid>
                ))
              )}
            </Grid>
          </motion.div>
        </Container>
      </Box>
      
      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h4" 
          textAlign="center" 
          mb={1}
          fontWeight="bold"
        >
          What Our Customers Say
        </Typography>
        <Typography 
          variant="body1" 
          textAlign="center" 
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}
        >
          Don't just take our word for it. Here's what our happy customers have to say about YOO!!!
        </Typography>
        
        <Grid container spacing={4}>
          {[
            {
              name: "Alex Johnson",
              role: "Food Enthusiast",
              quote: "YOO!!! has changed the way I order food. The quality is excellent and delivery is always on time!",
              rating: 5,
              image: "./images/user1.jpg?text=Alex"
            },
            {
              name: "Sarah Williams",
              role: "Busy Professional",
              quote: "As someone with a hectic schedule, YOO!!! saves me so much time. The app is intuitive and the food is delicious.",
              rating: 4.5,
              image: "./images/user2.jpg?text=Sarah"
            },
            {
              name: "Mike Chen",
              role: "Foodie",
              quote: "I've tried many food delivery services, but YOO!!! stands out with its quality ingredients and excellent customer service.",
              rating: 5,
              image: "./images/user3.jpg?text=Mike"
            }
          ].map((testimonial, index) => (
            <Grid item key={index} xs={12} md={4}>
              <Card sx={{ 
                height: '100%', 
                borderRadius: 4, 
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
                },
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Box
                      component="img"
                      src={testimonial.image}
                      alt={testimonial.name}
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        mr: 2,
                        objectFit: 'cover',
                      }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                      <Rating
                        value={testimonial.rating}
                        readOnly
                        precision={0.5}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                    "{testimonial.quote}"
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <StyledButton 
            variant="outlined" 
            color="primary" 
            sx={{ px: 4 }}
            component="a"
            href="/testimonials"
          >
            View All Reviews
          </StyledButton>
        </Box>
      </Container>
      
      {/* CTA Section */}
      <Box 
        sx={{ 
          bgcolor: '#f1f1f1', 
          py: 8,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          mt: 8
        }}
      >
        <Container maxWidth="md">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
                Ready to Order Delicious Food?
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                Download our app now and get special discount on your first order!
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  sx={{ 
                    bgcolor: 'white', 
                    color: '#764ba2',
                    px: 3,
                    py: 1.5,
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)'
                    },
                    borderRadius: 2
                  }}
                >
                  App Store
                </Button>
                <Button 
                  variant="outlined" 
                  sx={{ 
                    borderColor: 'white', 
                    color: 'white',
                    px: 3,
                    py: 1.5,
                    fontWeight: 'bold',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.7)',
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    },
                    borderRadius: 2
                  }}
                >
                  Google Play
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box 
                component="img"
                src="./images/logo1.png"
                alt="Mobile App"
                sx={{
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block',
                  mx: 'auto',
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                  transform: 'rotate(-5deg)'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* Snackbar Notification */}
      <Snackbar
        open={openPopup}
        autoHideDuration={3000}
        onClose={() => setOpenPopup(false)}
        message={popupMessage}
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: "#43a047", // Green background for success
            color: "#fff"
          }
        }}
      />
      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          bgcolor: '#111', 
          color: 'white',
          py: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 800, 
                    background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mr: 1
                  }}
                >
                  YOO!!!
                </Typography>
                <img src="/images/logo1.png" alt="Logo" style={{ width: 36, height: 36, borderRadius: "10px", }} />
              </Box>
              <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                Delicious food delivered to your doorstep. We make food ordering and delivery simple, reliable, and fun.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {[{ icon: <FacebookIcon />, name: 'facebook' },
                  { icon: <TwitterIcon />, name: 'twitter' },
                  { icon: <InstagramIcon />, name: 'instagram' },
                  { icon: <YouTubeIcon />, name: 'youtube' }].map((social) => (
                  <IconButton 
                    key={social.name} 
                    size="small" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&:hover': {
                        color: 'white',
                        transform: 'translateY(-3px)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Company
              </Typography>
              <List dense disablePadding>
                {['About Us', 'Careers', 'Blog', 'Press'].map(item => (
                  <ListItem key={item} sx={{ px: 0 }}>
                    <Button 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)', 
                        textTransform: 'none',
                        p: 0,
                        justifyContent: 'flex-start',
                        '&:hover': {
                          color: 'white',
                          backgroundColor: 'transparent'
                        }
                      }}
                    >
                      {item}
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Help
              </Typography>
              <List dense disablePadding>
                {['FAQ', 'Support', 'Contact Us', 'Privacy Policy'].map(item => (
                  <ListItem key={item} sx={{ px: 0 }}>
                    <Button 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)', 
                        textTransform: 'none',
                        p: 0,
                        justifyContent: 'flex-start',
                        '&:hover': {
                          color: 'white',
                          backgroundColor: 'transparent'
                        }
                      }}
                    >
                      {item}
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Subscribe to our newsletter
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                Get the latest news and special offers
              </Typography>
              <Box 
                component="form" 
                sx={{ 
                  display: 'flex',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  style={{
                    flex: 1,
                    border: 'none',
                    padding: '12px 16px',
                    backgroundColor: 'transparent',
                    color: 'white',
                    outline: 'none'
                  }}
                />
                <Button 
                  variant="contained" 
                  sx={{ 
                    borderRadius: 0,
                    background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                    px: 2
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
              © {new Date().getFullYear()} YOO!!! Food Delivery. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.5)', 
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  '&:hover': {
                    color: 'white',
                    backgroundColor: 'transparent'
                  }
                }}
              >
                Terms of Service
              </Button>
              <Button 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.5)', 
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  '&:hover': {
                    color: 'white',
                    backgroundColor: 'transparent'
                  }
                }}
              >
                Privacy Policy
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      
      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: 4,
            maxWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Typography variant="h6" fontWeight="bold">Login Required</Typography>
    <IconButton onClick={handleCloseDialog} size="small">
      <CloseIcon />
    </IconButton>
  </Box>
</DialogTitle>
<DialogContent>
  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
    Please login to access this feature.
  </Typography>
</DialogContent>
<DialogActions sx={{ p: 2, pt: 0 }}>
  <Button onClick={handleCloseDialog} sx={{ borderRadius: 2 }}>
    Cancel
  </Button>
  <Button 
    variant="contained" 
    onClick={() => navigate("/login")}
    sx={{ 
      borderRadius: 2,
      background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
    }}
  >
    Login
  </Button>
</DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;
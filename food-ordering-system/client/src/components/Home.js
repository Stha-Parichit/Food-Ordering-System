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
  InputAdornment
} from "@mui/material";
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
  boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
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
  
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'));

  // Sample categories and prices for demo
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'];
  const prices = ['$8.99', '$12.99', '$15.99', '$7.50', '$9.99', '$14.50'];

  const [selectedItem, setSelectedItem] = useState(null);
  const [openCustomizePopup, setOpenCustomizePopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [openPopup, setOpenPopup] = useState(false);

  /// Add to Cart with customization
const handleAddToCart = (item) => {
  setSelectedItem(item);
  setOpenCustomizePopup(true);
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

    const response = await axios.post("http://localhost:5000/cart", {
      food_id: item.id,
      user_id: userId,
      quantity: customization.quantity || 1,
      extraCheese: customization.extraCheese || false,
      extraMeat: customization.extraMeat || false,
      extraVeggies: customization.extraVeggies || false,
      noOnions: customization.noOnions || false,
      noGarlic: customization.noGarlic || false,
      spicyLevel: customization.spicyLevel || 'Medium',
      specialInstructions: customization.specialInstructions || ""
    });

    if (response.data.success) {
      // Update local cart for UI (optional, you could also re-fetch cart items)
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItemIndex = cart.findIndex(cartItem => 
        cartItem.id === item.id && 
        cartItem.customization && 
        cartItem.customization.extraCheese === customization.extraCheese &&
        cartItem.customization.extraMeat === customization.extraMeat &&
        cartItem.customization.noOnions === customization.noOnions
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
            specialInstructions: customization.specialInstructions
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
      if (customization.spicyLevel !== 'Medium') customizationDetails.push(`${customization.spicyLevel} Spice`);

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
          price: item.price,
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
          name: `Delicious Recipe ${i+1}`,
          description: "A mouth-watering dish that will satisfy your cravings.",
          image_url: "/images/default-placeholder.png",
          rating: Math.floor(Math.random() * 2) + 3 + Math.random(),
          price: prices[i % prices.length],
          category: categories[i % categories.length],
          preparationTime: Math.floor(Math.random() * 30) + 15 + ' min',
        }));
        setFoodItems(fallbackData);
      }
    };

    fetchFoodItems();
  }, []);

  // const handleAddToCart = () => {
  //   setOpenDialog(true);
  // };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleLoginRedirect = () => {
    navigate("/login");
    setOpenDialog(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          YOO!!!
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
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
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography 
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
                </Typography>
                <LocalDiningIcon 
                  sx={{ 
                    color: "#FF6B6B"
                  }} 
                />
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
                    href="/dashboard"
                  >
                    Dashboard
                  </Button>
                  
                </Box>
                
                <SearchBar>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search recipes…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </SearchBar>
              </>
            )}
            
            <Box sx={{ display: "flex", alignItems: "center" }}>
            {!isMobile && (
  <>
    <Button 
      variant="text"
      startIcon={<ShoppingCartIcon />}
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
      onClick={() => navigate("/")}
    >
      Logout
    </StyledButton>
  </>
)}
              {isMobile && (
                <IconButton color="inherit">
                  <ShoppingCartIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      
      {/* Mobile Drawer */}
      // Update the drawer buttons for logged-in state
<Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
  <Button variant="outlined" color="primary" fullWidth component="a" href="/profile">
    My Profile
  </Button>
  <Button variant="contained" color="primary" fullWidth onClick={() => navigate("/logout")}>
    Logout
  </Button>
</Box>
      
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
                      href="/menu"
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
                        <Typography variant="caption">Recipes</Typography>
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
                  src="/api/placeholder/600/400"
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
                        <PriceTag>{item.price}</PriceTag>
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
                        onSave={handleSaveCustomization}
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
              image: "/api/placeholder/100/100?text=Alex"
            },
            {
              name: "Sarah Williams",
              role: "Busy Professional",
              quote: "As someone with a hectic schedule, YOO!!! saves me so much time. The app is intuitive and the food is delicious.",
              rating: 4.5,
              image: "/api/placeholder/100/100?text=Sarah"
            },
            {
              name: "Mike Chen",
              role: "Foodie",
              quote: "I've tried many food delivery services, but YOO!!! stands out with its quality ingredients and excellent customer service.",
              rating: 5,
              image: "/api/placeholder/100/100?text=Mike"
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
                src="/api/placeholder/300/600"
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
                <LocalDiningIcon 
                  sx={{ 
                    color: '#FF6B6B'
                  }} 
                />
              </Box>
              <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                Delicious food delivered to your doorstep. We make food ordering and delivery simple, reliable, and fun.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {['facebook', 'twitter', 'instagram', 'youtube'].map(social => (
                  <IconButton 
                    key={social} 
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
                    <Box 
                      component="span" 
                      sx={{ 
                        width: 30, 
                        height: 30, 
                        borderRadius: '50%', 
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {social[0].toUpperCase()}
                    </Box>
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
    <Typography variant="h6" fontWeight="bold">Item added to cart</Typography>
    <IconButton onClick={handleCloseDialog} size="small">
      <CloseIcon />
    </IconButton>
  </Box>
</DialogTitle>
<DialogContent>
  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
    Your item has been added to the cart successfully.
  </Typography>
</DialogContent>
<DialogActions sx={{ p: 2, pt: 0 }}>
  <Button onClick={handleCloseDialog} sx={{ borderRadius: 2 }}>
    Continue Shopping
  </Button>
  <Button 
    variant="contained" 
    onClick={() => navigate("/cart")}
    sx={{ 
      borderRadius: 2,
      background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
    }}
  >
    View Cart
  </Button>
</DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;
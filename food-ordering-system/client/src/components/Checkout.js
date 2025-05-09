import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { 
  Button, TextField, Typography, Card, CardContent, Box, Grid, 
  Link, FormControl, Select, MenuItem, InputLabel, AppBar, Toolbar, 
  IconButton, Modal, Autocomplete, Menu, Divider, Badge, Avatar,
  Paper, List, ListItem, ListItemText, Container, CircularProgress,
  Drawer, ListItemIcon, useScrollTrigger, Slide, InputAdornment
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [cartCount, setCartCount] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [customCharityName, setCustomCharityName] = useState('');
  const [customCharityAmount, setCustomCharityAmount] = useState('');
  const [charityNameSuggestions] = useState([
    'Local Food Bank',
    'Hunger Relief Foundation',
    'Community Meals Program',
    'Children\'s Food Fund',
    'Senior Meals on Wheels',
    'Food Security Initiative',
    'Emergency Food Relief',
    'Rural Hunger Project',
    'School Meal Program',
    'Food Waste Reduction'
  ]);

  useEffect(() => {
    document.title = "Checkout - YOO!!!";
    fetchCartItems();
    fetchUserPoints();
    fetchUserAddresses();
  }, []);

  useEffect(() => {
        const isLoggedIn = localStorage.getItem("user_id");
        if (!isLoggedIn) {
          navigate("/");
        }
      }, [navigate]);

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

  const fetchUserAddresses = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const response = await axios.get(`${apiUrl}/api/addresses/${userId}`);
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
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
      setCustomCharityAmount('');
      setCustomCharityName('');
      localStorage.removeItem("selectedCharity");
    } else {
      const charityToSave = charity.id === 4 
        ? { 
            ...charity, 
            title: customCharityName || 'Custom donation',
            amount: customCharityAmount || '0' 
          }
        : charity;
      setSelectedCharity(charityToSave);
      localStorage.setItem("selectedCharity", JSON.stringify(charityToSave));
    }
  };

  const handleCustomCharityAmountChange = (event) => {
    const amount = event.target.value;
    setCustomCharityAmount(amount);
    if (selectedCharity?.id === 4) {
      const updatedCharity = { ...selectedCharity, amount };
      setSelectedCharity(updatedCharity);
      localStorage.setItem("selectedCharity", JSON.stringify(updatedCharity));
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
    { id: 1, title: 'Local food bank', amount: '500' },
    { id: 2, title: 'Hunger relief', amount: '1000' },
    { id: 3, title: 'Community Meals', amount: '1500' },
    { id: 4, title: 'Custom donation', amount: customCharityAmount || '0' }
  ];

  const subtotal = getSubtotal();
  const deliveryFee = 60;
  const charityDonation = selectedCharity ? parseInt(selectedCharity.amount.replace('Rs. ', '')) : 0;
  const discountPercentage = selectedDiscount ? parseInt(selectedDiscount.title) : 0;
  const discountAmount = (subtotal * discountPercentage / 100);
  // Add tax calculation (13% of subtotal)
  const tax = subtotal * 0.13;
  // Update total calculation to include tax
  const total = subtotal + deliveryFee + charityDonation + tax - discountAmount;

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

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const renderCharitySection = () => (
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
                {charity.id !== 4 && (
                  <Typography variant="caption" display="block">
                    Rs. {charity.amount}
                  </Typography>
                )}
              </Box>
            </Button>
          </Grid>
        ))}
      </Grid>
      {selectedCharity?.id === 4 && (
        <Box sx={{ mt: 2 }}>
          <Autocomplete
            value={customCharityName}
            onChange={(event, newValue) => {
              setCustomCharityName(newValue);
              if (selectedCharity?.id === 4) {
                setSelectedCharity(prev => ({
                  ...prev,
                  title: newValue || 'Custom donation'
                }));
              }
            }}
            options={charityNameSuggestions}
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                label="Charity Name"
                variant="outlined"
                fullWidth
                margin="normal"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  }
                }}
              />
            )}
          />
          <TextField
            type="number"
            label="Donation Amount"
            value={customCharityAmount}
            onChange={(e) => {
              setCustomCharityAmount(e.target.value);
              if (selectedCharity?.id === 4) {
                setSelectedCharity(prev => ({
                  ...prev,
                  amount: e.target.value || '0'
                }));
              }
            }}
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              }
            }}
          />
        </Box>
      )}
    </Paper>
  );

  const handleKhaltiPayment = async () => {
    try {
      // Fetch user information from the users table using userId
      const userResponse = await axios.get(`${apiUrl}/api/users/${userId}`);
      const user = userResponse.data;
  
      if (!user) {
        alert("Failed to fetch user information.");
        return;
      }
  
      // Initiate Khalti payment
      const response = await axios.post(`${apiUrl}/api/khalti/initiate`, {
        amount: subtotal + deliveryFee + charityDonation + tax - discountAmount, // Now includes tax
        purchase_order_id: `order_${Date.now()}`,
        purchase_order_name: "Food Order",
        customer_info: {
          user_id: userId,
          name: user.fullName,
          email: user.email,
          phone: user.phone?.toString() || "",
        },
        // Pass the breakdown so backend can use it
        order_breakdown: {
          subtotal,
          deliveryFee,
          charityDonation,
          tax,
          discountAmount
        }
      });
  
      // Save orderId to localStorage for use on success page
      if (response.data.orderId) {
        localStorage.setItem("orderId", response.data.orderId);
      }
  
      if (response.data.payment_url) {
        window.location.href = response.data.payment_url; // Redirect to Khalti payment portal
      } else {
        alert("Failed to initiate Khalti payment.");
      }
    } catch (error) {
      console.error("Error initiating Khalti payment:", error);
      alert(
        error?.response?.data?.message ||
        "An error occurred while initiating payment."
      );
    }
  };

  // Add this function to verify Khalti payment and trigger order insertion
  const handleKhaltiVerification = async (pidx) => {
    try {
      // userId is available from localStorage
      const response = await axios.post(`${apiUrl}/api/khalti/verify`, {
        pidx,
        user_id: userId
      });
      if (response.data && response.data.orderId) {
        await handleOrderSuccess(response.data.orderId);
        alert("Payment successful and order placed! Order ID: " + response.data.orderId);
        // Optionally redirect to order confirmation page
        navigate('/order-confirmation');
      } else {
        alert(response.data.message || "Payment verified, but order was not created.");
      }
    } catch (error) {
      alert(
        error?.response?.data?.message ||
        "Payment verification failed or order could not be created."
      );
    }
  };

  // Call this after payment is verified and you have the orderId
  const updateOrderStatusToPlaced = async (orderId) => {
    try {
      await axios.put(`${apiUrl}/api/orders/${orderId}/status`, {
        status: "Order Placed"
      });
      // Optionally show a success message or redirect
    } catch (error) {
      console.error("Failed to update order status:", error);
      // Optionally show an error message
    }
  };

  // Example usage after payment verification (call this in your payment success handler):
  // await updateOrderStatusToPlaced(orderId);

  // Call this after payment is verified (e.g., on payment success page)
  const placeOrderAfterKhalti = async () => {
    try {
      // Prepare order items for backend (minimal info, adjust as needed)
      const orderItems = cartItems.map(item => ({
        food_id: item.food_id,
        quantity: item.quantity,
        price: item.item_price
      }));

      const response = await axios.post(`${apiUrl}/orders`, {
        user_id: userId,
        items: orderItems,
        total: total
      });

      if (response.status === 200 || response.status === 201) {
        alert("Order placed successfully!");
        navigate('/order-confirmation');
      } else {
        alert("Order placement failed after payment.");
      }
    } catch (error) {
      alert(
        error?.response?.data?.message ||
        "Order placement failed after payment."
      );
    }
  };

  // Insert charity donation after order is placed
  const insertCharityDonation = async (orderId, charity) => {
    if (!charity || !orderId) return;
    try {
      await axios.post(`${apiUrl}/api/charity-donations`, {
        order_id: orderId,
        user_id: userId,
        charity_name: charity.title,
        amount: parseInt(charity.amount)
      });
    } catch (error) {
      console.error("Failed to insert charity donation:", error);
    }
  };

  // Insert loyalty record after order is placed
  const insertLoyaltyRecord = async (orderId, pointsUsed) => {
    if (!orderId) return;
    try {
      await axios.post(`${apiUrl}/api/loyalty`, {
        order_id: orderId,
        user_id: userId,
        points_used: pointsUsed || 0
      });
    } catch (error) {
      console.error("Failed to insert loyalty record:", error);
    }
  };

  const handleOrderSuccess = async (orderId) => {
    // Insert charity donation if selected
    if (selectedCharity) {
      await insertCharityDonation(orderId, selectedCharity);
    }
    // Insert loyalty record if discount was used
    if (selectedDiscount) {
      await insertLoyaltyRecord(orderId, selectedDiscount.requiredPoints);
    }
  };

  const handlePaymentAndNavigation = async () => {
    try {
      if (!deliveryAddress) {
        alert("Please enter a delivery address");
        return;
      }

      // First handle loyalty points
      const pointsToAdd = !selectedDiscount ? Math.floor(total / 1000) : 0;
      const pointsToDeduct = selectedDiscount ? selectedDiscount.requiredPoints : 0;

      // Update loyalty points first
      const loyaltyResponse = await axios.post(`${apiUrl}/update-loyalty-points`, {
        user_id: userId,
        total_amount: total,
        used_points: pointsToDeduct,
        points_earned: pointsToAdd
      });

      if (!loyaltyResponse.data.message || loyaltyResponse.data.message !== "Loyalty points updated successfully") {
        console.error("Loyalty API response:", loyaltyResponse.data);
        throw new Error("Failed to update loyalty points. Please try again later.");
      }

      // Handle charity donation if selected
      if (selectedCharity) {
        const charityPayload = {
          user_id: userId,
          charity_name: selectedCharity.title,
          amount: parseInt(selectedCharity.amount),
          donation_date: new Date().toISOString()
        };

        console.log("Charity donation payload:", charityPayload); // Log payload for debugging

        const charityResponse = await axios.post(`${apiUrl}/api/charity-donations`, charityPayload);

        if (!charityResponse.data.message || charityResponse.data.message !== "Charity donation recorded successfully.") {
          console.error("Charity API response:", charityResponse.data);
          throw new Error("Failed to process charity donation. Please try again later.");
        }
      }

      // Clear the cart and populate orders table for COD
      if (paymentMethod === 'COD') {
        try {
          // Populate the orders table
          const orderPayload = {
            user_id: userId,
            items: cartItems.map(item => ({
              food_id: item.food_id,
              quantity: item.quantity,
              price: item.item_price,
              customization: {
                extraCheese: item.customization?.extraCheese || false,
                extraMeat: item.customization?.extraMeat || false,
                extraVeggies: item.customization?.extraVeggies || false,
                noOnions: item.customization?.noOnions || false,
                noGarlic: item.customization?.noGarlic || false,
                spicyLevel: item.customization?.spicyLevel || "Medium",
                specialInstructions: item.customization?.specialInstructions || "",
                glutenFree: item.customization?.glutenFree || false,
                cookingPreference: item.customization?.cookingPreference || null,
                sides: item.customization?.sides 
                  ? item.customization.sides
                      .map(side => `${side.name} × ${side.quantity || 1}`)
                      .join(", ")
                  : null,
                dipSauce: item.customization?.dipSauce 
                  ? item.customization.dipSauce
                      .map(dip => `${dip.name} × ${dip.quantity || 1}`)
                      .join(", ")
                  : null,
              }
            })),
            total_amount: total // Use total_amount instead of total
          };

          // Add new endpoint for COD order creation
          const orderResponse = await axios.post(`${apiUrl}/api/orders/cod`, orderPayload);

          if (!orderResponse.data.message || orderResponse.status !== 201) {
            console.error("Order API response:", orderResponse.data);
            throw new Error("Failed to create order. Please try again.");
          }

          console.log("Order created successfully:", orderResponse.data);

          // Clear the cart
          await axios.delete(`${apiUrl}/cart`, { params: { user_id: userId } });
          console.log("Cart cleared successfully for COD.");
        } catch (error) {
          console.error("Failed to process COD order:", error);
          throw new Error("Failed to process COD order. Please try again.");
        }
      }

      // Store delivery address and payment method
      localStorage.setItem("deliveryAddress", deliveryAddress);
      localStorage.setItem("paymentMethod", paymentMethod);

      // Now proceed with payment based on method
      if (paymentMethod === 'Standard') {
        await handleKhaltiPayment();
      } else {
        navigate('/order-confirmation');
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert(error.message || "There was an error processing your payment. Please try again.");
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      backgroundColor: "#f9f9f9" 
    }}>
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
                <img src="/images/logo1.png" alt="Logo" style={{ width: 50, height: 45 }} />
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
                    onClick={handleLogout}
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
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      <Container maxWidth="lg" sx={{ mt: 10, mb: 8, flex: 1 }}>
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
                  options={addresses.map(addr => 
                    ` ${addr.street}, ${addr.city}, ${addr.state}, ${addr.zip_code}${addr.landmark ? `, Near ${addr.landmark}` : ''}`
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Delivery Address"
                      variant="outlined"
                      fullWidth
                      required
                      placeholder="Select your delivery address"
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
              {renderCharitySection()}
              
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
                    <MenuItem value="Standard">Khalti</MenuItem>
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
                  <ListItem sx={{ 
                    py: 1, 
                    px: 0,
                    transition: "background-color 0.3s ease",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "rgba(255,152,0,0.03)"
                    }
                  }}>
                    <ListItemText primary={<Typography variant="body1" color="text.secondary">Tax (13%)</Typography>} />
                    <Typography variant="body1" fontWeight="500">Rs.{tax.toFixed(2)}</Typography>
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
                    onClick={handlePaymentAndNavigation}
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
                    {paymentMethod === 'Standard' ? 'Pay with Khalti' : 'Proceed with COD'}
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
      </div>
    );
  };
  
  export default Checkout;
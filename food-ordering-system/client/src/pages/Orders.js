import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom"; // Add navigation
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Box,
  Chip,
  Badge,
  Divider,
  Avatar,
  IconButton,
  useMediaQuery,
  Paper,
  Stack,
  TextField,
  InputAdornment,
  Skeleton,
  Tooltip,
  LinearProgress,
  CardMedia
} from "@mui/material";
import {
  AccessTime,
  Receipt,
  DeliveryDining,
  RestaurantMenu,
  Info,
  Star,
  StarBorder,
  StarHalf,
  Repeat,
  Search,
  FilterList,
  SortByAlpha,
  LocalShipping,
  Favorite,
  FavoriteBorder,
  KeyboardArrowRight,
  MoreVert,
  LocalOffer,
  LocalDining,
  Room
} from "@mui/icons-material";
import axios from "axios";

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#FF4D00",
      light: "#FF7A45",
      dark: "#CA2E00",
      contrastText: "#FFFFFF"
    },
    secondary: {
      main: "#2E7D32",
      light: "#4CAF50",
      dark: "#1B5E20",
      contrastText: "#FFFFFF"
    },
    background: {
      default: "#F9FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#263238",
      secondary: "#546E7A",
    },
    error: {
      main: "#D32F2F",
    },
    warning: {
      main: "#FFA000",
    },
    info: {
      main: "#0288D1",
    },
    success: {
      main: "#388E3C",
    },
    divider: "rgba(0, 0, 0, 0.08)",
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 800,
      letterSpacing: 0.2,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(0,0,0,0.05)",
    "0px 4px 8px rgba(0,0,0,0.05)",
    "0px 8px 16px rgba(0,0,0,0.05)",
    "0px 12px 24px rgba(0,0,0,0.05)",
    "0px 16px 32px rgba(0,0,0,0.05)",
    ...Array(19).fill("none"), // Remaining shadows
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: "8px 20px",
          boxShadow: "0 4px 14px 0 rgba(0,0,0,0.1)",
        },
        contained: {
          "&:hover": {
            boxShadow: "0 6px 20px rgba(255, 77, 0, 0.25)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: "hidden",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 16px 32px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: "0",
        },
      },
    },
  },
});

// Custom food emoji/icons for different food categories
const FoodIcon = ({ category }) => {
  const getIcon = () => {
    switch (category?.toLowerCase()) {
      case "pizza":
        return "🍕";
      case "burger":
        return "🍔";
      case "pasta":
        return "🍝";
      case "dessert":
        return "🧁";
      case "drink":
        return "🥤";
      case "indian":
        return "🍛";
      case "chinese":
        return "🥡";
      case "salad":
        return "🥗";
      default:
        return "🍽️";
    }
  };

  return (
    <Box sx={{ 
      fontSize: "1.2rem", 
      width: 24, 
      height: 24, 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center" 
    }}>
      {getIcon()}
    </Box>
  );
};

// Custom status component with enhanced styling
const OrderStatus = ({ status }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return { 
          color: "#388E3C", 
          background: "rgba(56, 142, 60, 0.12)",
          icon: <LocalShipping fontSize="small" sx={{ mr: 0.5 }} />
        };
      case "in progress":
        return { 
          color: "#0288D1", 
          background: "rgba(2, 136, 209, 0.12)",
          icon: <LocalShipping fontSize="small" sx={{ mr: 0.5 }} />
        };
      case "preparing":
        return { 
          color: "#FFA000", 
          background: "rgba(255, 160, 0, 0.12)",
          icon: <LocalDining fontSize="small" sx={{ mr: 0.5 }} />
        };
      case "cancelled":
        return { 
          color: "#D32F2F", 
          background: "rgba(211, 47, 47, 0.12)",
          icon: <Info fontSize="small" sx={{ mr: 0.5 }} />
        };
      default:
        return { 
          color: "#616161", 
          background: "rgba(97, 97, 97, 0.12)",
          icon: <LocalDining fontSize="small" sx={{ mr: 0.5 }} />
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      icon={config.icon}
      label={status || "Processing"}
      sx={{
        backgroundColor: config.background,
        color: config.color,
        fontWeight: "600",
        fontSize: "0.75rem",
        "& .MuiChip-icon": {
          color: config.color
        }
      }}
      size="small"
    />
  );
};

// Star rating component
const StarRating = ({ rating = 4.5 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const maxStars = 5;

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} sx={{ color: "#FFC107", fontSize: 16 }} />
      ))}
      {hasHalfStar && (
        <StarHalf sx={{ color: "#FFC107", fontSize: 16 }} />
      )}
      {[...Array(maxStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <StarBorder key={`empty-${i}`} sx={{ color: "#FFC107", fontSize: 16 }} />
      ))}
      <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 600, color: "#FFA000" }}>
        {rating.toFixed(1)}
      </Typography>
    </Box>
  );
};

// Delivery timeline component
const DeliveryTimeline = ({ status = "delivered" }) => {
  const getProgress = () => {
    switch (status.toLowerCase()) {
      case "delivered":
        return 100;
      case "in progress":
        return 66;
      case "preparing":
        return 33;
      default:
        return 0;
    }
  };

  return (
    <Box sx={{ width: "100%", my: 1 }}>
      <LinearProgress 
        variant="determinate" 
        value={getProgress()} 
        sx={{ 
          height: 6, 
          borderRadius: 3,
          backgroundColor: "rgba(0,0,0,0.05)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 3,
            backgroundImage: "linear-gradient(to right, #FF9800, #FF5722)"
          }
        }}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Typography variant="caption" color="text.secondary">Order Placed</Typography>
        <Typography variant="caption" color="text.secondary">Preparing</Typography>
        <Typography variant="caption" color="text.secondary">On the way</Typography>
        <Typography variant="caption" color="text.secondary">Delivered</Typography>
      </Box>
    </Box>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          alert("Please log in to view your orders.");
          navigate("/login"); // Redirect to login if user is not logged in
          return;
        }

        const response = await axios.get(`http://localhost:5000/orders?user_id=${userId}`);
        
        // Add some sample statuses for visualization
        const ordersWithStatus = response.data.map((order, index) => {
          const statuses = ["Delivered", "In Progress", "Preparing", "Cancelled"];
          // Calculate total for each order from its items
          const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          
          return {
            ...order,
            status: statuses[index % statuses.length],
            restaurant: "Delicious Bites" + (index % 3 + 1),
            rating: (3 + Math.random() * 2).toFixed(1),
            total: total // Add the calculated total
          };
        });
        
        setOrders(ordersWithStatus);
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Providing default data if API fails
        setOrders([
          {
            id: "1001",
            created_at: new Date().toISOString(),
            status: "Delivered",
            restaurant: "Delicious Bites1",
            rating: "4.5",
            total: 1250.50,
            items: [
              {
                food_id: "101",
                food_name: "Margherita Pizza",
                price: 450.50,
                quantity: 1,
                image_url: "",
                customization: { extraCheese: true }
              },
              {
                food_id: "102",
                food_name: "Garlic Bread",
                price: 150,
                quantity: 2,
                image_url: "",
                customization: null
              }
            ]
          },
          {
            id: "1002",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            status: "In Progress",
            restaurant: "Delicious Bites2",
            rating: "4.2",
            total: 850.75,
            items: [
              {
                food_id: "201",
                food_name: "Chicken Burger",
                price: 350.75,
                quantity: 1,
                image_url: "",
                customization: { noOnions: true, extraCheese: true }
              },
              {
                food_id: "202",
                food_name: "French Fries",
                price: 250.00,
                quantity: 2,
                image_url: "",
                customization: null
              }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const formatCustomization = (customization) => {
    if (!customization) return null;
    const details = [];
    if (customization.extraCheese) details.push("Extra Cheese");
    if (customization.extraMeat) details.push("Extra Meat");
    if (customization.extraVeggies) details.push("Extra Veggies");
    if (customization.noOnions) details.push("No Onions");
    if (customization.noGarlic) details.push("No Garlic");
    if (customization.glutenFree) details.push("Gluten-Free");
    if (customization.spicyLevel) details.push(`Spicy Level: ${customization.spicyLevel}`);
    if (customization.specialInstructions) details.push(`${customization.specialInstructions}`);
    if (customization.sides) details.push(`Sides: ${customization.sides}`);
    if (customization.dipSauce) details.push(`Dip/Sauce: ${customization.dipSauce}`);
    return details;
  };

  const reorderItems = (order) => {
    // Logic to reorder items would go here
    alert(`Reordering items from order #${order.id}`);
  };

  // Filter function
  const filteredOrders = orders.filter(order => {
    // Filter by status if not 'all'
    if (filter !== "all" && order.status.toLowerCase() !== filter.toLowerCase()) {
      return false;
    }
    
    // Search functionality
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      // Check if order ID, restaurant name, or any item name contains search term
      return order.id.toString().includes(searchLower) || 
             order.restaurant.toLowerCase().includes(searchLower) ||
             order.items.some(item => item.food_name.toLowerCase().includes(searchLower));
    }
    
    return true;
  });

  // Loading skeleton for better user experience
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Skeleton variant="text" width={300} height={60} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={50} sx={{ borderRadius: 2, mb: 3 }} />
          </Box>
          
          {[1, 2].map((_, index) => (
            <Paper 
              key={index}
              elevation={2} 
              sx={{ 
                mb: 3, 
                borderRadius: 3, 
                overflow: "hidden" 
              }}
            >
              <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Skeleton variant="text" width={150} />
                <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: 1 }} />
              </Box>
              <Divider />
              {[1, 2].map((_, idx) => (
                <Box key={idx} sx={{ p: 2, display: "flex" }}>
                  <Skeleton variant="rectangular" width={70} height={70} sx={{ borderRadius: 2, mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                    <Box sx={{ display: "flex", mt: 1, gap: 1 }}>
                      <Skeleton variant="rectangular" width={40} height={20} sx={{ borderRadius: 1 }} />
                      <Skeleton variant="rectangular" width={80} height={20} sx={{ borderRadius: 1 }} />
                    </Box>
                  </Box>
                </Box>
              ))}
              <Divider />
              <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
                <Skeleton variant="text" width={100} />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 30 }} />
                  <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 30 }} />
                </Box>
              </Box>
            </Paper>
          ))}
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        pb: 6
      }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Page Header with gradient background */}
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            elevation={0}
            sx={{
              background: "linear-gradient(135deg, #FF7A45 0%, #FF4D00 100%)",
              borderRadius: 4,
              mb: 4,
              p: 4,
              position: "relative",
              overflow: "hidden"
            }}
          >
            <Box sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundImage: "radial-gradient(circle at 20% 90%, rgba(255,255,255,0.12) 0%, transparent 20%), radial-gradient(circle at 90% 10%, rgba(255,255,255,0.12) 0%, transparent 20%)",
              zIndex: 0
            }} />
            
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  color: "white",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  mb: 1
                }}
              >
                Your Order History
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "rgba(255,255,255,0.9)" }}>
                Track your culinary journey and reorder your favorites with ease
              </Typography>
            </Box>
          </Paper>

          {/* Search and Filter Bar */}
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            elevation={2}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 3,
              display: "flex",
              flexWrap: "wrap",
              gap: 2
            }}
          >
            <TextField
              placeholder="Search orders, restaurants, or dishes..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                flexGrow: 1,
                minWidth: { xs: "100%", sm: "auto" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  backgroundColor: "rgba(0,0,0,0.02)"
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                )
              }}
            />
            
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                Filter:
              </Typography>
              {["All", "Delivered", "In Progress", "Preparing", "Cancelled"].map((status) => (
                <Chip
                  key={status}
                  label={status}
                  clickable
                  variant={filter.toLowerCase() === status.toLowerCase() ? "filled" : "outlined"}
                  color={filter.toLowerCase() === status.toLowerCase() ? "primary" : "default"}
                  size="small"
                  onClick={() => setFilter(status.toLowerCase())}
                  sx={{ 
                    fontWeight: 500,
                    borderRadius: 3,
                    px: 0.5
                  }}
                />
              ))}
            </Box>
          </Paper>

          {filteredOrders.length === 0 ? (
            <Card 
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              elevation={3}
              sx={{ 
                p: 5, 
                textAlign: "center",
                borderRadius: 4,
                background: "linear-gradient(to bottom, white, #f9f9f9)"
              }}
            >
              <Box sx={{ 
                width: 120, 
                height: 120, 
                borderRadius: "50%", 
                backgroundColor: "rgba(255, 77, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px"
              }}>
                <RestaurantMenu sx={{ fontSize: 60, color: theme.palette.primary.main }} />
              </Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                {searchTerm || filter !== "all" 
                  ? "No matching orders found" 
                  : "You haven't placed any orders yet"}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 500, mx: "auto", mb: 4 }}>
                {searchTerm || filter !== "all" 
                  ? "Try changing your search terms or filters to find what you're looking for." 
                  : "Your culinary journey is waiting to begin! Browse our menu and discover delicious meals crafted just for you."}
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                sx={{ 
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  backgroundImage: "linear-gradient(135deg, #FF7A45 0%, #FF4D00 100%)",
                }}
                onClick={() => navigate("/")}
              >
                Explore Menu
              </Button>
            </Card>
          ) : (
            <Stack spacing={3}>
              {filteredOrders.map((order, index) => (
                <Card 
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  key={order.id}
                  elevation={2}
                  sx={{ overflow: "visible" }}
                >
                  {/* Order header with restaurant info */}
                  <Box 
                    sx={{ 
                      p: 2.5, 
                      background: "linear-gradient(to right, #f9f9f9, #ffffff)",
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: "primary.light",
                          width: 40,
                          height: 40,
                          mr: 2,
                          boxShadow: "0 4px 8px rgba(255, 77, 0, 0.2)"
                        }}
                      >
                        <LocalDining />
                      </Avatar>
                      
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                          <Typography variant="h6" sx={{ fontSize: "1.1rem" }}>
                            {order.restaurant}
                          </Typography>
                          <StarRating rating={parseFloat(order.rating)} />
                          <Tooltip title="Add to favorites">
                            <IconButton size="small" sx={{ color: "#FF7A45", ml: 1 }}>
                              <FavoriteBorder fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Chip 
                            icon={<Room sx={{ fontSize: "0.875rem !important" }} />}
                            label="2.5 km away" 
                            size="small" 
                            sx={{ 
                              height: 20, 
                              fontSize: "0.7rem", 
                              bgcolor: "rgba(0,0,0,0.04)",
                              color: "text.secondary"
                            }} 
                          />
                          <Box 
                            component="span" 
                            sx={{ 
                              width: 4, 
                              height: 4, 
                              borderRadius: "50%", 
                              bgcolor: "text.disabled", 
                              display: "inline-block" 
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Order #{order.id}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccessTime fontSize="small" sx={{ color: "text.secondary", mr: 0.5 }} />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>
                      <OrderStatus status={order.status} />
                    </Box>
                  </Box>

                  {/* Delivery timeline */}
                  <Box sx={{ px: 3, pt: 2 }}>
                    <DeliveryTimeline status={order.status} />
                  </Box>

                  {/* Order items */}
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ pt: 1 }}>
                      {order.items.map((item, idx) => (
                        <React.Fragment key={`${item.food_id}-${idx}`}>
                          <Box sx={{ 
                            display: "flex", 
                            p: 2.5,
                            backgroundColor: idx % 2 === 0 ? "rgba(0,0,0,0.01)" : "transparent",
                            transition: "background-color 0.3s",
                            "&:hover": {
                              backgroundColor: "rgba(255, 77, 0, 0.04)"
                            }
                          }}>
                            <Box 
                              sx={{ 
                                position: "relative",
                                mr: 2
                              }}
                            >
                              <Avatar 
                                src={item.image_url} 
                                alt={item.food_name}
                                variant="rounded"
                                sx={{ 
                                  width: 80, 
                                  height: 80, 
                                  borderRadius: 3,
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
                                }}
                              />
                              <Box 
                                sx={{ 
                                  position: "absolute", 
                                  bottom: -10, 
                                  left: -10, 
                                  backgroundColor: "primary.main", 
                                  color: "white",
                                  width: 26,
                                  height: 26,
                                  borderRadius: "50%",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  boxShadow: "0 2px 8px rgba(255, 77, 0, 0.3)",
                                  fontWeight: "bold",
                                  fontSize: "0.75rem"
                                }}
                              >
                                {item.quantity}x
                              </Box>
                            </Box>
                            
                            <Box sx={{ flexGrow: 1 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography variant="subtitle1" fontWeight={600}>
                                    {item.food_name}
                                  </Typography>
                                  <FoodIcon category={idx % 5 === 0 ? "pizza" : idx % 5 === 1 ? "burger" : idx % 5 === 2 ? "pasta" : idx % 5 === 3 ? "dessert" : "drink"} />
                                </Box>
                                <Typography 
                                  variant="subtitle1" 
                                  fontWeight={700}
                                  sx={{ 
                                    color: "primary.main",
                                  }}
                                >
                                  Rs.{item.price.toFixed(2)}
                                </Typography>
                              </Box>
                              
                              {/* Display customizations */}
                              {formatCustomization(item.customization) && (
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                                  {formatCustomization(item.customization).map((customization, cidx) => (
                                    <Chip 
                                    key={cidx}
                                    label={customization}
                                    size="small"
                                    sx={{ 
                                      height: 20,
                                      fontSize: "0.6rem",
                                      backgroundColor: "rgba(0,0,0,0.04)",
                                      color: "text.secondary"
                                    }}
                                  />
                                ))}
                              </Box>
                            )}
                          </Box>
                        </Box>
                        {idx < order.items.length - 1 && (
                          <Divider variant="middle" sx={{ opacity: 0.6 }} />
                        )}
                      </React.Fragment>
                    ))}
                  </Box>
                </CardContent>

                {/* Order footer with total and actions */}
                <Box 
                  sx={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    p: 2.5,
                    backgroundColor: "rgba(0,0,0,0.02)",
                    borderTop: "1px solid rgba(0,0,0,0.06)",
                    flexWrap: "wrap",
                    gap: 2
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
                      <Receipt sx={{ mr: 1, color: "primary.main" }} />
                      Total: <Box component="span" sx={{ ml: 1, color: "primary.main" }}>Rs.{order.total.toFixed(2)}</Box>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Incl. delivery fee and taxes
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button 
                      variant="outlined" 
                      size={isMobile ? "small" : "medium"}
                      color="primary"
                      startIcon={<Info />}
                      sx={{ borderRadius: 30 }}
                    >
                      Order Details
                    </Button>
                    
                    <Button 
                      variant="contained" 
                      size={isMobile ? "small" : "medium"}
                      color="primary"
                      startIcon={<Repeat />}
                      sx={{ 
                        borderRadius: 30,
                        backgroundImage: "linear-gradient(to right, #FF7A45, #FF4D00)"
                      }}
                      onClick={() => reorderItems(order)}
                    >
                      Reorder
                    </Button>
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>
        )}

        {/* Load more button */}
        {filteredOrders.length > 0 && (
          <Box 
            sx={{ 
              display: "flex", 
              justifyContent: "center", 
              mt: 4 
            }}
          >
            <Button 
              variant="outlined"
              sx={{ 
                py: 1.2,
                px: 4,
                borderRadius: 30,
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2
                }
              }}
            >
              Load More Orders
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  </ThemeProvider>
);
};

export default Orders;

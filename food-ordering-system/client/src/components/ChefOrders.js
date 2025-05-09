import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
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
  Room,
  Edit,
  CheckCircle
} from "@mui/icons-material";
import axios from "axios";
import ChefSidebar from './ChefSidebar';

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
    ...Array(19).fill("none"),
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

// Delivery timeline component
const DeliveryTimeline = ({ status = "Order Placed" }) => {
  const statusStages = [
    "Order Placed",
    "Cooking",
    "Prepared for Delivery",
    "Off for Delivery",
    "Delivered",
  ];

  const getProgress = () => {
    const currentStageIndex = statusStages.findIndex(
      (stage) => stage.toLowerCase() === status.toLowerCase()
    );
    return currentStageIndex >= 0
      ? ((currentStageIndex + 1) / statusStages.length) * 100
      : 0;
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
            backgroundImage: "linear-gradient(to right, #FF9800, #FF5722)",
          },
        }}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        {statusStages.map((stage, index) => (
          <Typography
            key={stage}
            variant="caption"
            color={
              getProgress() >= ((index + 1) / statusStages.length) * 100
                ? "primary"
                : "text.secondary"
            }
            sx={{
              textAlign: "center",
              width: `${100 / statusStages.length}%`,
              opacity:
                getProgress() >= ((index + 1) / statusStages.length) * 100
                  ? 1
                  : 0.5,
            }}
          >
            {stage}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

// Order status component
const OrderStatus = ({ status }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return { 
          color: "#388E3C", 
          background: "rgba(56, 142, 60, 0.12)",
          icon: <LocalShipping fontSize="small" sx={{ mr: 0.5 }} />
        };
      case "off for delivery":
        return { 
          color: "#0288D1", 
          background: "rgba(2, 136, 209, 0.12)",
          icon: <LocalShipping fontSize="small" sx={{ mr: 0.5 }} />
        };
      case "prepared for delivery":
        return { 
          color: "#FFA000", 
          background: "rgba(255, 160, 0, 0.12)",
          icon: <LocalDining fontSize="small" sx={{ mr: 0.5 }} />
        };
      case "cooking":
        return { 
          color: "#FF6D00", 
          background: "rgba(255, 109, 0, 0.12)",
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
  const validRating = Math.max(0, Math.min(Number(rating) || 0, 5));
  const fullStars = Math.floor(validRating);
  const hasHalfStar = validRating % 1 !== 0;
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
        {validRating.toFixed(1)}
      </Typography>
    </Box>
  );
};

const ChefOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  // Predefined status options
  const statusOptions = [
    "Order Placed", 
    "Cooking", 
    "Prepared for Delivery", 
    "Off for Delivery", 
    "Delivered",
    "Cancelled"
  ];

  // Format customization details
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/chef/orders");
        // Convert total_amount to number
        const ordersWithParsedTotals = response.data.map(order => ({
          ...order,
          total_amount: parseFloat(order.total_amount) || 0
        }));
        setOrders(ordersWithParsedTotals);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !selectedStatus) {
      console.error("Selected order or status is missing.");
      setSnackbar({ open: true, message: "Please select an order and status.", severity: "error" });
      return;
    }
  
    try {
      const apiUrl = `http://localhost:5000/api/orders/${selectedOrder.id}/status`;
      console.log("Updating order status at:", apiUrl);
  
      const response = await axios.put(apiUrl, { status: selectedStatus });
  
      if (response.status === 200) {
        console.log("Order status update response:", response.data);
  
        // Update the local state to reflect the new status
        const updatedOrders = orders.map(order =>
          order.id === selectedOrder.id
            ? { ...order, status: selectedStatus }
            : order
        );
  
        setOrders(updatedOrders);
        setStatusUpdateDialogOpen(false);
  
        // Show a success notification
        setSnackbar({ open: true, message: `Order #${selectedOrder.id} status updated to ${selectedStatus}`, severity: "success" });
      } else {
        console.error("Unexpected response status:", response.status);
        setSnackbar({ open: true, message: "Failed to update order status. Please try again.", severity: "error" });
      }
    } catch (error) {
      console.error("Error updating order status:", error.response?.data || error.message);
  
      // Show a more specific error message if available
      const errorMessage = error.response?.data?.message || "Failed to update order status. Please try again.";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    }
  };
  

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const openStatusUpdateDialog = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setStatusUpdateDialogOpen(true);
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrderDetails(order);
    setOrderDetailsOpen(true);
  };

  // Filter function with separation
  const filteredAndSeparatedOrders = orders.reduce((acc, order) => {
    // Apply filters
    if (filter !== "all" && order.status.toLowerCase() !== filter.toLowerCase()) {
      return acc;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = order.id.toString().includes(searchLower) || 
                          order.customer_name?.toLowerCase().includes(searchLower) ||
                          order.items?.some(item => item.food_name.toLowerCase().includes(searchLower));
      if (!matchesSearch) return acc;
    }
    
    // Separate orders
    if (order.status?.toLowerCase() === 'delivered') {
      acc.delivered.push(order);
    } else {
      acc.ongoing.push(order);
    }
    
    return acc;
  }, { ongoing: [], delivered: [] });

  // Render Loading Skeleton (same as in previous implementation)
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Loading skeleton content remains the same */}
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: 'flex', 
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}>
        <ChefSidebar 
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
        />
        
        <Box sx={{ flexGrow: 1 }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Page Header */}
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
                Track your culinary journey and manage orders with ease
              </Typography>
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
                {["All", "Delivered", "Order Placed", "Cooking", "Prepared for Delivery", "Off for Delivery", "Cancelled"].map((status) => (
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

            {filteredAndSeparatedOrders.ongoing.length === 0 && 
             filteredAndSeparatedOrders.delivered.length === 0 ? (
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
              <Box>
                {/* Active Orders Section */}
                {filteredAndSeparatedOrders.ongoing.length > 0 && (
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 3,
                        mt: 4,
                        color: 'primary.main',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <LocalShipping /> Active Orders ({filteredAndSeparatedOrders.ongoing.length})
                    </Typography>
                    <Stack spacing={3}>
                      {filteredAndSeparatedOrders.ongoing.map((order, index) => (
                        <Card 
                          component={motion.div}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                          key={order.id}
                          elevation={2}
                          sx={{ overflow: "visible" }}
                        >
                          {/* Order Header */}
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
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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

                          {/* Delivery Timeline */}
                          <Box sx={{ px: 3, pt: 2 }}>
                            <DeliveryTimeline status={order.status} />
                          </Box>

                          {/* Order Items */}
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
                                          <FoodIcon category={item.category} />
                                        </Box>
                                        <Typography 
                                          variant="subtitle1" 
                                          fontWeight={700}
                                          sx={{ 
                                            color: "primary.main",
                                          }}
                                        >
                                          Rs.{(Number(item.price) || 0).toFixed(2)}
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

                          {/* Order Footer */}
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
                                Total: <Box component="span" sx={{ ml: 1, color: "primary.main" }}>
                                  Rs.{(order.total_amount || 0).toFixed(2)}
                                </Box>
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Incl. delivery fee and taxes
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: "flex", gap: 2 }}>
                              <Button 
                                variant="contained" 
                                size={isMobile ? "small" : "medium"}
                                color="primary"
                                startIcon={<Edit />}
                                sx={{ 
                                  borderRadius: 30,
                                  backgroundImage: "linear-gradient(to right, #FF7A45, #FF4D00)"
                                }}
                                onClick={() => openStatusUpdateDialog(order)}
                              >
                                Update Status
                              </Button>
                            </Box>
                          </Box>
                        </Card>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Completed Orders Section */}
                {filteredAndSeparatedOrders.delivered.length > 0 && (
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 3,
                        mt: 4,
                        color: 'success.main',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <CheckCircle /> Past Orders ({filteredAndSeparatedOrders.delivered.length})
                    </Typography>
                    <Stack spacing={3}>
                      {filteredAndSeparatedOrders.delivered.map((order, index) => (
                        <Card 
                          component={motion.div}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                          key={order.id}
                          elevation={2}
                          sx={{ overflow: "visible" }}
                        >
                          {/* Order Header */}
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
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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

                          {/* Delivery Timeline */}
                          <Box sx={{ px: 3, pt: 2 }}>
                            <DeliveryTimeline status={order.status} />
                          </Box>

                          {/* Order Items */}
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
                                          <FoodIcon category={item.category} />
                                        </Box>
                                        <Typography 
                                          variant="subtitle1" 
                                          fontWeight={700}
                                          sx={{ 
                                            color: "primary.main",
                                          }}
                                        >
                                          Rs.{(Number(item.price) || 0).toFixed(2)}
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

                          {/* Order Footer */}
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
                                Total: <Box component="span" sx={{ ml: 1, color: "primary.main" }}>
                                  Rs.{(order.total_amount || 0).toFixed(2)}
                                </Box>
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Incl. delivery fee and taxes
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: "flex", gap: 2 }}>
                              <Button 
                                variant="contained" 
                                size={isMobile ? "small" : "medium"}
                                color="primary"
                                startIcon={<Edit />}
                                sx={{ 
                                  borderRadius: 30,
                                  backgroundImage: "linear-gradient(to right, #FF7A45, #FF4D00)"
                                }}
                                onClick={() => openStatusUpdateDialog(order)}
                              >
                                Update Status
                              </Button>
                            </Box>
                          </Box>
                        </Card>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            )}
          </Container>
        </Box>
      </Box>

      {/* Status Update Dialog */}
      <Dialog
        open={statusUpdateDialogOpen}
        onClose={() => setStatusUpdateDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Order #{selectedOrder?.id} - {selectedOrder?.restaurant}
          </Typography>
          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              label="Status"
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setStatusUpdateDialogOpen(false)} 
            color="secondary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleStatusUpdate}
            color="primary"
            variant="contained"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog
        open={orderDetailsOpen}
        onClose={() => setOrderDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          pb: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box>
            Order Details #{selectedOrderDetails?.id}
          </Box>
          <OrderStatus status={selectedOrderDetails?.status} />
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrderDetails && (
            <Box>
              {/* Order Info Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Order Information
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.default', 
                  borderRadius: 1,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2
                }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Order Date</Typography>
                    <Typography variant="body1">
                      {new Date(selectedOrderDetails.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                    <Typography variant="body1" color="primary.main" fontWeight="600">
                      Rs.{selectedOrderDetails.total.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Order Items Section */}
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Ordered Items
              </Typography>
              <Stack spacing={2}>
                {selectedOrderDetails.items.map((item, index) => (
                  <Paper 
                    key={index}
                    elevation={0}
                    sx={{ 
                      p: 2,
                      bgcolor: 'background.default',
                      borderRadius: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Avatar
                        src={item.image_url}
                        variant="rounded"
                        sx={{ width: 60, height: 60 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'flex-start'
                        }}>
                          <Typography variant="subtitle1">
                            {item.food_name}
                          </Typography>
                          <Typography variant="subtitle1" color="primary.main">
                            Rs.{(Number(item.price) || 0).toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mt: 0.5
                        }}>
                          <Chip 
                            size="small"
                            label={`Qty: ${item.quantity}`}
                            sx={{ 
                              bgcolor: 'primary.light',
                              color: 'white',
                              fontSize: '0.75rem'
                            }}
                          />
                          <FoodIcon category={item.category} />
                        </Box>
                        {/* Display Customizations */}
                        {item.customization && (
                          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {Object.entries(item.customization)
                              .filter(([key, value]) => value && key !== 'specialInstructions')
                              .map(([key, value]) => (
                                <Chip
                                  key={key}
                                  label={key.replace(/([A-Z])/g, ' $1').trim()}
                                  size="small"
                                  sx={{ 
                                    height: 20,
                                    fontSize: '0.65rem',
                                    bgcolor: 'rgba(0,0,0,0.04)'
                                  }}
                                />
                            ))}
                          </Box>
                        )}
                        {item.customization?.specialInstructions && (
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Note: {item.customization.specialInstructions}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>

              {/* Timeline */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Order Timeline
                </Typography>
                <DeliveryTimeline status={selectedOrderDetails.status} />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDetailsOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default ChefOrders;
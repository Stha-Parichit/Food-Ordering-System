import React, { useState, useEffect } from 'react';
import { 
  Button, Box, Typography, Grid, TextField, IconButton, 
  Menu, MenuItem, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody, Paper, 
  List, ListItem, ListItemText, Avatar, Badge, Chip, Rating, Divider
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddIcon from "@mui/icons-material/Add";
import { Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from "chart.js";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from './Sidebar';
import axios from 'axios';
import { io } from "socket.io-client"; // Import socket.io-client
import AddressDialog from './AddressDialog';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "user@example.com";
  const [recentOrders, setRecentOrders] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [deliveryAddressAnchorEl, setDeliveryAddressAnchorEl] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [socket, setSocket] = useState(null);
  const [ordersByMonth, setOrdersByMonth] = useState([]);
  const [cuisinePreferences, setCuisinePreferences] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [notifications, setNotifications] = useState([]); 
  const [unreadCount, setUnreadCount] = useState(0);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [deliveryAddresses, setDeliveryAddresses] = useState([]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  
  useEffect(() => {
    document.title = "YOO!!! Food Dashboard";

    const fetchRecentOrders = async () => {
      try {
        const response = await axios.get(`/api/recent-orders`, {
          params: { userId: localStorage.getItem("user_Id") }
        });
        setRecentOrders(response.data);
      } catch (error) {
        console.error("Error fetching recent orders:", error);
      }
    };

    const fetchDashboardStats = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        const [ordersResponse, loyaltyResponse] = await Promise.all([
          axios.get(`/api/orders/stats`, { params: { user_id: userId } }),
          axios.get(`/loyalty-points`, { params: { user_id: userId } })
        ]);

        setTotalSpent(ordersResponse.data.totalSpent || 0);
        setTotalOrders(ordersResponse.data.totalOrders || 0);
        setLoyaltyPoints(loyaltyResponse.data.points || 0);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setTotalSpent(0);
        setTotalOrders(0);
        setLoyaltyPoints(0);
      }
    };

    fetchRecentOrders();
    fetchDashboardStats();

    // Simulated data for other states
    setFavoriteItems([
      { id: 1, name: "Butter Chicken", restaurant: "Spice Garden", price: 250, image: "/api/placeholder/60/60" },
      { id: 2, name: "Pepperoni Pizza", restaurant: "Pizza Palace", price: 350, image: "/api/placeholder/60/60" },
      { id: 3, name: "Chocolate Cake", restaurant: "Sweet Dreams", price: 180, image: "/api/placeholder/60/60" },
    ]);
    
    setActiveDelivery({
      id: "#104",
      restaurant: "Burger Joint",
      items: ["Double Cheeseburger", "Fries", "Soda"],
      status: "On the way",
      estimatedTime: 15,
      driverName: "Alex",
      driverPhone: "+91 9876543210"
    });

    const fetchCartCount = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        const response = await axios.get(`http://localhost:5000/cart?user_id=${userId}`);
        if (response.data.success && response.data.items) {
          setCartCount(response.data.items.reduce((sum, item) => sum + item.quantity, 0)); // Sum up quantities
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

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://localhost:5000", {
      path: "/socket.io/",
    });
    setSocket(newSocket);

    // Clean up on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchActiveOrder = async () => {
      try {
        const userId = localStorage.getItem("user_id");

        if (!userId) {
          console.warn("No user ID found in localStorage.");
          setActiveDelivery(null);
          return;
        }

        // Fetch active orders
        const response = await axios.get(`http://localhost:5000/orders`, {
          params: { user_id: userId, status: 'active' }
        });

        if (!response.data || response.data.length === 0) {
          console.warn("No active orders found.");
          setActiveDelivery(null);
          return;
        }

        // Filter for orders with status "Off for Delivery" and sort by creation date
        const offForDeliveryOrders = response.data
          .filter(order => order.status === 'Off for Delivery')
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        const oldestOrder = offForDeliveryOrders[0]; // Select the oldest order

        if (oldestOrder) {
          // Fetch order details
          const orderDetailsResponse = await axios.get(`http://localhost:5000/orders/${oldestOrder.id}`);
          setActiveDelivery(orderDetailsResponse.data);
        } else {
          console.warn("No orders with status 'Off for Delivery' found.");
          setActiveDelivery(null);
        }
      } catch (error) {
        console.error("Error fetching active order:", error);
        setActiveDelivery(null);
      }
    };

    fetchActiveOrder();

    // Listen for real-time updates via socket
    if (socket) {
      socket.on("order-updated", (updatedOrder) => {
        if (activeDelivery && updatedOrder.id === activeDelivery.id) {
          setActiveDelivery((prev) => ({
            ...prev,
            status: updatedOrder.status,
          }));
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("order-updated");
      }
    };
  }, [socket, activeDelivery]);

  useEffect(() => {
    const fetchActiveOrders = async () => {
      try {
        const userId = localStorage.getItem("user_id");

        if (!userId) {
          console.warn("No user ID found in localStorage.");
          setActiveDelivery(null);
          return;
        }

        // Fetch all orders
        const response = await axios.get(`http://localhost:5000/orders`, {
          params: { user_id: userId }
        });

        if (!response.data || response.data.length === 0) {
          console.warn("No orders found.");
          setActiveDelivery(null);
          return;
        }

        // Group orders by ID and select the one with the greatest progress
        const uniqueOrders = response.data.reduce((acc, order) => {
          if (!acc[order.id] || order.progress > acc[order.id].progress) {
            acc[order.id] = order;
          }
          return acc;
        }, {});

        const ordersArray = Object.values(uniqueOrders);

        // Sort orders by progress (descending) and creation date (ascending)
        const sortedOrders = ordersArray.sort((a, b) => {
          if (b.progress !== a.progress) return b.progress - a.progress;
          return new Date(a.created_at) - new Date(b.created_at);
        });

        setActiveDelivery(sortedOrders[0] || null); // Show the top order
      } catch (error) {
        console.error("Error fetching active orders:", error);
        setActiveDelivery(null);
      }
    };

    fetchActiveOrders();

    // Listen for real-time updates via socket
    if (socket) {
      socket.on("order-updated", (updatedOrder) => {
        setActiveDelivery((prev) => {
          if (prev && updatedOrder.id === prev.id) {
            return { ...prev, status: updatedOrder.status, progress: updatedOrder.progress };
          }
          return prev;
        });
      });
    }

    return () => {
      if (socket) {
        socket.off("order-updated");
      }
    };
  }, [socket]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        // Fetch monthly orders data
        const monthlyResponse = await axios.get(`/api/orders/monthly-stats`, { params: { user_id: userId } });
        setOrdersByMonth(monthlyResponse.data.length > 0 ? monthlyResponse.data : [{ month: "No Data", count: 0 }]);

        // Fetch cuisine preferences data
        const cuisineResponse = await axios.get(`/api/orders/cuisine-stats`, { params: { user_id: userId } });
        setCuisinePreferences(cuisineResponse.data.length > 0 ? cuisineResponse.data : [{ category: "No Data", count: 0 }]);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, []);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const userId = localStorage.getItem("user_Id");
        if (!userId) return;

        // Fetch order statistics
        const orderStatsResponse = await axios.get(`/api/orders/stats`, { params: { user_id: userId } });
        setOrderStats(orderStatsResponse.data);

        // Fetch category statistics
        const categoryStatsResponse = await axios.get(`/api/orders/cuisine-stats`, { params: { user_id: userId } });
        setCategoryStats(categoryStatsResponse.data);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };

    fetchGraphData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`/api/food-items`);
        const foodItems = response.data || [];

        // Define icons for specific categories
        const categoryIcons = {
          Appetizers: "🍢",
          "Main Course": "🍛",
          Desserts: "🍰",
          Beverages: "🥤",
          Breakfast: "🍳",
          Lunch: "🥗",
          Dinner: "🍽️",
          Snacks: "🍟",
          Vegan: "🥬",
          Vegetarian: "🥦",
          "Gluten-Free": "🌾",
          Seafood: "🦞",
          Chicken: "🍗",
          Buff: "🦬",
        };

        // Group food items by category
        const groupedCategories = foodItems.reduce((acc, item) => {
          const category = item.category || "Uncategorized";
          if (!acc[category]) {
            acc[category] = { 
              name: category, 
              count: 0, 
              icon: categoryIcons[category] || "🍽️" // Assign respective icon or fallback
            };
          }
          acc[category].count += 1;
          return acc;
        }, {});

        setCategories(Object.values(groupedCategories));
      } catch (error) {
        console.error("Error fetching food items:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFavoriteItems = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        const response = await axios.get(`http://localhost:5000/api/favorites?user_id=${userId}`);
        if (response.data.success) {
          const favoriteFoodIds = response.data.favorites.map((fav) => fav.food_id);

          // Fetch food item details for the favorite items
          const foodResponse = await axios.get(`http://localhost:5000/api/food-items`);
          const favoriteItemsData = foodResponse.data.filter((item) => favoriteFoodIds.includes(item.id));
          setFavoriteItems(favoriteItemsData);
        }
      } catch (error) {
        console.error("Error fetching favorite items:", error);
      }
    };

    fetchFavoriteItems();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        const response = await axios.get(`http://localhost:5000/api/notifications`, {
          params: { user_id: userId },
        });

        // Sort notifications by date and read status (unread first)
        const sortedNotifications = (response.data || []).sort((a, b) => {
          if (a.is_read === b.is_read) {
            return new Date(b.created_at) - new Date(a.created_at);
          }
          return a.is_read - b.is_read;
        });

        setNotifications(sortedNotifications);
        setUnreadCount(sortedNotifications.filter(n => n.is_read === 0).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // Set up real-time updates
    if (socket) {
      socket.on("new-notification", (notification) => {
        if (notification.user_id === localStorage.getItem("user_id")) {
          setNotifications(prev => {
            const updated = [notification, ...prev];
            // Re-sort to maintain order
            return updated.sort((a, b) => {
              if (a.is_read === b.is_read) {
                return new Date(b.created_at) - new Date(a.created_at);
              }
              return a.is_read - b.is_read;
            });
          });
          setUnreadCount(prev => prev + 1);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("new-notification");
      }
    };
  }, [socket]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        const response = await axios.get(`http://localhost:5000/api/addresses/${userId}`);
        if (response.data) {
          setDeliveryAddresses(response.data);
        } else {
          setDeliveryAddresses([]);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setDeliveryAddresses([]);
      }
    };

    fetchAddresses();
  }, []);

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:5000/notifications/${notificationId}`, {
        user_id: localStorage.getItem("user_id"),
        read: true
      });
      
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, is_read: 1 }
          : notification
      ));
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      
    } catch (error) {
      console.error("Error marking notification as read:", error);
      const errorMsg = error.response?.data?.message || "Could not update notification status";
      alert(errorMsg);
    }
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };
  
  const handleAddressClick = (event) => {
    setDeliveryAddressAnchorEl(event.currentTarget);
  };
  
  const handleAddressClose = () => {
    setDeliveryAddressAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Chart Data
  const pieData = {
    labels: cuisinePreferences.map(item => item.category),
    datasets: [{
      data: cuisinePreferences.map(item => item.count),
      backgroundColor: [
        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", 
        "#FF9F40", "#4D5360", "#E7E9ED", "#97BBCD", "#DCDCDC"
      ].slice(0, cuisinePreferences.length)
    }]
  };

  const lineData = {
    labels: ordersByMonth.map(item => item.month),
    datasets: [{
      label: "Orders",
      data: ordersByMonth.map(item => item.count),
      borderColor: "#FF6384",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      tension: 0.3,
      fill: true
    }]
  };

  const orderStatsData = {
    labels: orderStats.map(stat => stat.month),
    datasets: [{
      label: "Orders",
      data: orderStats.map(stat => stat.count),
      borderColor: "#36A2EB",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      tension: 0.3,
      fill: true
    }]
  };

  const categoryStatsData = {
    labels: categoryStats.map(stat => stat.category),
    datasets: [{
      data: categoryStats.map(stat => stat.count),
      backgroundColor: [
        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", 
        "#FF9F40", "#4D5360", "#E7E9ED", "#97BBCD", "#DCDCDC"
      ].slice(0, categoryStats.length)
    }]
  };

  const chartOptions = { 
    responsive: true, 
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      }
    }
  };
  
  // Discount calculation for loyalty
  const discountLevels = [
    { points: 5, discount: 5 },
    { points: 8, discount: 7 },
    { points: 10, discount: 8 },
    { points: 12, discount: 10 },
    { points: 15, discount: 15 },
  ];
  const nextLevel = discountLevels.find(level => loyaltyPoints < level.points) || { points: 0, discount: 0 };
  const pointsToNextReward = nextLevel.points - loyaltyPoints;

  // Fallback for empty data
  const isLineDataEmpty = ordersByMonth.length === 0 || ordersByMonth.every(item => item.count === 0);
  const isPieDataEmpty = cuisinePreferences.length === 0 || cuisinePreferences.every(item => item.count === 0);

  // Update the notification menu content
  const renderNotificationContent = (notification) => {
    const getNotificationIcon = (type) => {
      switch (type) {
        case 'order': return '🛍️';
        case 'offer': return '🎉';
        case 'delivery': return '🚚';
        default: return '📢';
      }
    };

    const timeDifference = (date) => {
      const diff = new Date() - new Date(date);
      const minutes = Math.floor(diff / 60000);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      return new Date(date).toLocaleDateString();
    };

    return (
      <MenuItem 
        key={notification.id}
        onClick={() => {
          if (notification.is_read === 0) {
            markNotificationAsRead(notification.id);
          }
          handleNotificationClose();
        }}
        sx={{
          py: 2,
          px: 2.5,
          borderBottom: '1px solid #f5f5f5',
          bgcolor: notification.is_read === 0 ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
          <Avatar sx={{
            width: 40,
            height: 40,
            bgcolor: notification.is_read === 0 ? 'primary.main' : 'grey.300'
          }}>
            {getNotificationIcon(notification.type)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" sx={{ 
              mb: 0.5,
              fontWeight: notification.is_read === 0 ? 600 : 400
            }}>
              {notification.title || 'New Notification'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {notification.message}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {timeDifference(notification.created_at)}
            </Typography>
          </Box>
          {notification.is_read === 0 && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                alignSelf: 'center',
              }}
            />
          )}
        </Box>
      </MenuItem>
    );
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        handleLogout={handleLogout} 
      />
      
      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, width: { sm: `calc(100% - 240px)` } }}>
        {/* Top bar */}
        <Box sx={{ 
          display: 'flex', 
          mb: 3, 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' }, 
          justifyContent: 'space-between',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleSidebar}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" fontWeight="bold">Food Dashboard</Typography>
          </Box>
          
          {/* Search bar */}
          {/* <Box component="form" onSubmit={handleSearch} sx={{ 
            display: 'flex',
            width: { xs: '100%', md: '40%' },
            position: 'relative',
            borderRadius: 2,
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <TextField
              fullWidth
              placeholder="Search for food..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton type="submit" aria-label="search">
                    <SearchIcon />
                  </IconButton>
                ),
                sx: { borderRadius: 2 }
              }}
            />
          </Box> */}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleAddressClick}>
              <LocationOnIcon color="primary" />
              <Typography variant="body2" sx={{ ml: 0.5, display: { xs: 'none', sm: 'block' } }}>
                Home
              </Typography>
            </Box>
            
            <IconButton onClick={handleNotificationClick}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <IconButton onClick={() => navigate("/cart")}>
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: '#f5f5f5', 
              borderRadius: 40, 
              p: 0.5,
              cursor: 'pointer'
            }}
            onClick={handleProfileClick}
            >
              <Avatar sx={{ backgroundColor: '#ff9800', width: 32, height: 32 }}>
                {userEmail?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Typography variant="body2" sx={{ ml: 1, mr: 1, display: { xs: 'none', sm: 'block' } }}>
                {userEmail.split('@')[0]}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Menus */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseProfileMenu}
          sx={{ mt: 1 }}
        >
          <MenuItem onClick={() => navigate("/profile")}>My Profile</MenuItem>
          <MenuItem onClick={() => navigate("/orders")}>My Orders</MenuItem>
          <MenuItem onClick={() => navigate("/favorites")}>Favorites</MenuItem>
          <MenuItem onClick={() => navigate("/addresses")}>Addresses</MenuItem>
          <MenuItem onClick={() => navigate("/payment-methods")}>Payment Methods</MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
              mt: 1.5,
              borderRadius: 2,
              minWidth: 360,
              maxWidth: 400,
              '& .MuiList-root': {
                paddingTop: 0,
                paddingBottom: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'center', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Notifications {unreadCount > 0 && `(${unreadCount} new)`}
            </Typography>
          </Box>
          {notifications.length > 0 ? (
            <>
              <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {notifications.map(notification => renderNotificationContent(notification))}
              </Box>
              {unreadCount > 0 && (
                <Box sx={{ p: 2, borderTop: '1px solid #eee', textAlign: 'center' }}>
                  <Button
                    size="small"
                    onClick={async () => {
                      try {
                        await Promise.all(
                          notifications
                            .filter(n => n.is_read === 0)
                            .map(n => markNotificationAsRead(n.id))
                        );
                        handleNotificationClose();
                      } catch (error) {
                        console.error("Error marking all as read:", error);
                      }
                    }}
                  >
                    Mark all as read
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No notifications
              </Typography>
            </Box>
          )}
        </Menu>
        <Menu
          anchorEl={deliveryAddressAnchorEl}
          open={Boolean(deliveryAddressAnchorEl)}
          onClose={handleAddressClose}
          sx={{ 
            mt: 1,
            '& .MuiPaper-root': {
              width: 320,
              maxHeight: 400,
              color: 'text.secondary',
            }
          }}
        >
          <MenuItem  sx={{ bgcolor: 'grey.100' }}>
            <LocationOnIcon sx={{ mr: 1 }} color="primary" />
            <Typography variant="subtitle2">Delivery Address</Typography>
          </MenuItem>

          {deliveryAddresses.length > 0 ? (
            deliveryAddresses.map(address => (
              <MenuItem 
                key={address.id} 
                onClick={handleAddressClose}
                sx={{ 
                  py: 2,
                  display: 'block',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 0.5
                  }}
                >
                  {address.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word'
                  }}
                >
                  {address.address}
                </Typography>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled sx={{ py: 2 }}>
              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <Typography variant="body2" color="text.secondary">
                  No saved addresses
                </Typography>
              </Box>
            </MenuItem>
          )}
          
          <Divider />
          <MenuItem 
            onClick={() => {
              handleAddressClose();
              setOpenAddressDialog(true);
            }}
            sx={{ 
              color: 'primary.main',
              py: 1.5,
              display: 'flex',
              alignItems: 'center' 
            }}
          >
            <AddIcon sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body2">Add New Address</Typography>
          </MenuItem>
        </Menu>

        {/* Active delivery tracking - only show if there's an active delivery */}
        {activeDelivery && activeDelivery.items?.length > 0 ? (
          <Card sx={{
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            mb: 3,
            background: 'white',
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <CardContent sx={{ p: 0 }}>
              {/* Header Section */}
              <Box sx={{
                p: 3,
                background: 'linear-gradient(135deg, #FF8E53 0%, #FE6B8B 100%)',
                color: 'white'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">Live Order Tracking</Typography>
                  <Chip
                    label={activeDelivery.status || "Unknown"}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 'medium',
                      '& .MuiChip-label': { px: 2 }
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <DeliveryDiningIcon sx={{ fontSize: 40, opacity: 0.9 }} />
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Order #{activeDelivery.id}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Estimated Delivery: {activeDelivery.estimated_delivery_time || "30-45 minutes"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Order Progress */}
              <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">Order Progress</Typography>
                  <Typography variant="caption" color="success.main">On Time</Typography>
                </Box>
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flexGrow: 1, height: 4, bgcolor: '#f0f0f0', borderRadius: 2 }}>
                    <Box 
                      sx={{ 
                        width: activeDelivery.status === 'Delivered' ? '100%' : '75%', 
                        height: '100%', 
                        bgcolor: '#FF8E53', 
                        borderRadius: 2,
                        transition: 'width 0.3s ease'
                      }} 
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">75% </Typography>
                  </Box>
              </Box>

              {/* Order Items */}
              <Box sx={{ p: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Order Items</Typography>
                <Box sx={{ mt: 2 }}>
                  {activeDelivery.items.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        py: 1.5,
                        borderBottom: index !== activeDelivery.items.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none'
                      }}
                    >
                      <Avatar 
                        variant="rounded" 
                        src={item.image_url} 
                        sx={{ 
                          width: 48, 
                          height: 48, 
                          mr: 2,
                          bgcolor: 'grey.100'
                        }}
                      >
                        🍽️
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2">{item.food_name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Quantity: {item.quantity}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle2" fontWeight="medium">
                        Rs. {item.price}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box sx={{ 
                p: 3, 
                bgcolor: 'rgba(0,0,0,0.02)', 
                borderTop: '1px solid rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Total Amount</Typography>
                  <Typography variant="h6" color="text.primary" fontWeight="bold">
                    Rs. {activeDelivery.total_amount}
                  </Typography>
                </Box>
                {/* <Button
                  variant="contained"
                  onClick={() => navigate(`/order/${activeDelivery.id}`)}
                  sx={{
                    bgcolor: '#FF8E53',
                    '&:hover': { bgcolor: '#FE6B8B' }
                  }}
                >
                  Track Order Details
                </Button> */}
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Card sx={{ 
            borderRadius: 4, 
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
            mb: 3,
            bgcolor: '#f8f9fa',
            border: '2px dashed #dee2e6'
          }}>
            <CardContent sx={{ 
              p: 4, 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1
            }}>
              <LocalShippingIcon sx={{ fontSize: 48, color: '#adb5bd', mb: 1 }} />
              <Typography variant="h6" color="text.secondary">No Active Orders</Typography>
              <Typography variant="body2" color="text.secondary">
                Your orders will appear here when you place one
              </Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                onClick={() => navigate('/menu')}
              >
                Browse Menu
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', height: '100%', background: 'linear-gradient(135deg,rgb(255, 161, 99) 0%, #FF8E53 100%)' }}>
              <CardContent sx={{ p: 3, color: 'white' }}>
                <Typography variant="h6" gutterBottom>Total Spent</Typography>
                <Typography variant="h4" fontWeight="bold">Rs. {totalSpent}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>+18% from last month</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="textSecondary">Total Orders</Typography>
                <Typography variant="h4" fontWeight="bold">{totalOrders}</Typography>
                <Typography variant="body2" color="success.main">+12% from last month</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" gutterBottom color="textSecondary">Loyalty Points</Typography>
                  <FavoriteIcon color="error" />
                </Box>
                <Typography variant="h4" fontWeight="bold">{loyaltyPoints}</Typography>
                {pointsToNextReward > 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    {pointsToNextReward} points to next reward
                  </Typography>
                ) : (
                  <Typography variant="body2" color="success.main">
                    Maximum level reached!
                  </Typography>
                )}
                <Box sx={{ mt: 1, width: '100%', height: 4, bgcolor: '#f0f0f0', borderRadius: 2 }}>
                  <Box sx={{ width: `${(loyaltyPoints / nextLevel.points) * 100}%`, height: '100%', bgcolor: '#FF6384', borderRadius: 2 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" gutterBottom color="textSecondary">Current Discount</Typography>
                  <LocalOfferIcon color="primary" />
                </Box>
                <Typography variant="h4" fontWeight="bold">{nextLevel.discount}%</Typography>
                <Typography variant="body2" color="text.secondary">
                  Next level: {nextLevel.points} points
                </Typography>
                {/* <Button 
                  variant="outlined" 
                  size="small" 
                  color="primary" 
                  startIcon={<LocalOfferIcon />}
                  onClick={() => navigate("/offers")}
                  sx={{ mt: 1 }}
                >
                  View Offers
                </Button> */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Food Categories */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Food Categories</Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {categories.map((category) => (
            <Grid item xs={6} sm={4} md={2.4} key={category.name}>
              <Card 
                sx={{ 
                  borderRadius: 4, 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }
                }}
                // onClick={() => navigate(`/category/${category.name.toLowerCase()}`)}
              >
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ mb: 1 }}>{category.icon || "🍽️"}</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">{category.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{category.count} options</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Your Food Habits</Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Order Trends</Typography>
                <Box sx={{ height: 240 }}>
                  {isLineDataEmpty ? (
                    <Typography variant="body2" color="textSecondary" align="center">
                      No data available for Order Trends.
                    </Typography>
                  ) : (
                    <Line data={lineData} options={chartOptions} />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Cuisine Preferences</Typography>
                <Box sx={{ height: 240 }}>
                  {isPieDataEmpty ? (
                    <Typography variant="body2" color="textSecondary" align="center">
                      No data available for Cuisine Preferences.
                    </Typography>
                  ) : (
                    <Pie data={pieData} options={chartOptions} />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Orders and Favorites */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Recent Orders</Typography>
                  <Button size="small" onClick={() => navigate("/orders")}>View All</Button>
                </Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Date</TableCell>
                      {/* <TableCell>Restaurant</TableCell> */}
                      <TableCell>Amount</TableCell>
                      <TableCell>Rating</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow 
                        key={order.order_id} 
                        hover 
                        sx={{ cursor: 'pointer' }} 
                        onClick={() => navigate(`/order/${order.order_id}`)}
                      >
                        <TableCell>{order.order_id}</TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                        {/* <TableCell>{order.restaurant_name || "N/A"}</TableCell> */}
                        <TableCell>Rs. {order.total_amount}</TableCell>
                        <TableCell>
                          <Rating value={order.rating || 0} size="small" readOnly />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Favorite Items</Typography>
                  {/* <Button 
                    size="small" 
                    onClick={() => navigate("/favorites")}
                    startIcon={<BookmarkIcon />}
                  >
                    View All
                  </Button> */}
                </Box>
                <List disablePadding>
                  {favoriteItems.length > 0 ? (
                    favoriteItems.map((item) => (
                      <ListItem 
                        key={item.id} 
                        sx={{ 
                          px: 0, 
                          py: 1,
                          borderBottom: '1px solid #f0f0f0',
                          '&:last-child': { borderBottom: 'none' }
                        }}
                      >
                        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                          <Avatar 
                            variant="rounded" 
                            src={item.image_url} 
                            alt={item.name}
                            sx={{ width: 48, height: 48, mr: 2 }}
                          />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1" fontWeight="medium">{item.name}</Typography>
                            <Typography variant="body2" color="textSecondary">{item.category}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">Rs. {item.price}</Typography>
                            {/* <Button 
                              size="small" 
                              variant="contained" 
                              color="primary"
                              sx={{ mt: 0.5, minWidth: 0, px: 1.5 }}
                              onClick={() => navigate(`/item/${item.id}`)}
                            >
                              View
                            </Button> */}
                          </Box>
                        </Box>
                      </ListItem>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>
                      No favorite items found.
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recommendations/Promotions Section */}
        <Box sx={{ mt: 4, mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Recommended For You</Typography>
          <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <Box sx={{ position: 'relative', height: 180, bgcolor: '#f5f5f7' }}>
              <img 
                src="./images/special-offer.png" 
                alt="Special Offer" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                p: 3, 
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                color: 'white'
              }}>
                <Typography variant="h5" fontWeight="bold">New User Special Offer!</Typography>
                <Typography variant="body1">Get 20% off on your first order</Typography>
              </Box>
            </Box>
            <CardContent sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" fontWeight="medium">Use code: <Chip label="WELCOME20" color="primary" size="small" /> at checkout</Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                  {/* <Button variant="contained" color="primary" onClick={() => navigate("/offers")}>
                    View Offer Details
                  </Button> */}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* Footer */}
        {/* <Box sx={{ mt: 6, p: 3, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 2 }}></Box>
          <Typography variant="body2" color="textSecondary">© 2025 YOO!!! Food Delivery. All Rights Reserved</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            24/7 Customer Support: +91 1800-123-4567 | help@yoofood.com
          </Typography>
        </Box> */}

        {/* Add this at the end of your component's return statement */}
        <AddressDialog
          open={openAddressDialog}
          onClose={(success) => {
            setOpenAddressDialog(false);
            if (success) {
              // Optionally refresh any address data
            }
          }}
          userId={localStorage.getItem('user_id')}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
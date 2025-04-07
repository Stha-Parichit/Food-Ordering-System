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
import { Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from "chart.js";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from './Sidebar';
import axios from 'axios';

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

  // Food categories
  const categories = [
    { name: "Pizza", icon: "🍕", count: 24 },
    { name: "Burgers", icon: "🍔", count: 18 },
    { name: "Sushi", icon: "🍣", count: 15 },
    { name: "Desserts", icon: "🍰", count: 12 },
    { name: "Beverages", icon: "🥤", count: 20 },
  ];

  // Saved delivery addresses
  const deliveryAddresses = [
    { id: 1, name: "Home", address: "123 Main St, Apartment 4B" },
    { id: 2, name: "Work", address: "456 Office Park, Building C" },
    { id: 3, name: "Gym", address: "789 Fitness Ave" },
  ];

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
        const userId = localStorage.getItem("user_Id");
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
    labels: ["Pizza & Pasta", "Indian", "Asian", "Fast Food", "Desserts"],
    datasets: [{ 
      data: [35, 25, 15, 15, 10], 
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]
    }]
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ 
      label: "Orders", 
      data: [15, 18, 22, 20, 25, 23], 
      borderColor: "#FF6384",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      tension: 0.3,
      fill: true
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
  const loyaltyDiscountPercent = 10;
  const pointsToNextReward = 250 - 130;

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
              <Badge badgeContent={3} color="error">
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
          sx={{ mt: 1 }}
        >
          <MenuItem disabled>Notifications</MenuItem>
          <MenuItem>Your order from YOO!!! is on the way!</MenuItem>
          <MenuItem>20% off for the first purchase!</MenuItem>
          <MenuItem>Rate your last order</MenuItem>
        </Menu>
        
        <Menu
          anchorEl={deliveryAddressAnchorEl}
          open={Boolean(deliveryAddressAnchorEl)}
          onClose={handleAddressClose}
          sx={{ mt: 1 }}
        >
          <MenuItem disabled>Delivery Address</MenuItem>
          {deliveryAddresses.map(address => (
            <MenuItem key={address.id} onClick={handleAddressClose}>
              <ListItemText 
                primary={address.name} 
                secondary={address.address}
              />
            </MenuItem>
          ))}
          <Divider />
          <MenuItem onClick={() => navigate("/addresses")}>
            + Add New Address
          </MenuItem>
        </Menu>

        {/* Active delivery tracking - only show if there's an active delivery */}
        {activeDelivery && (
          <Card sx={{ 
            borderRadius: 4, 
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
            mb: 3,
            background: 'linear-gradient(135deg, #ffe259 0%, #ffa751 100%)' 
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold">Your order is on the way!</Typography>
                  {/* <Typography variant="body2">Order #{activeDelivery.id} from {activeDelivery.restaurant}</Typography> */}
                </Box>
                <Chip 
                  icon={<DeliveryDiningIcon />} 
                  label={`Arriving in ~${activeDelivery.estimatedTime} min`}
                  color="primary"
                  sx={{ fontWeight: 'bold', mt: { xs: 1, sm: 0 } }}
                />
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: 'rgba(255,255,255,0.8)', 
                p: 2, 
                borderRadius: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: { xs: 0, sm: 3 } }}>
                  <Avatar sx={{ bgcolor: '#4caf50', mr: 1 }}>
                    {activeDelivery.driverName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">{activeDelivery.driverName}</Typography>
                    <Typography variant="body2" color="textSecondary">{activeDelivery.driverPhone}</Typography>
                  </Box>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ mx: 2, display: { xs: 'none', sm: 'block' } }} />
                <Divider sx={{ width: '100%', display: { xs: 'block', sm: 'none' } }} />
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
                  <Typography variant="body2">
                    {activeDelivery.items.join(", ")}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Button variant="outlined" size="small">Call Driver</Button>
                    <Button variant="contained" size="small">Track Order</Button>
                  </Box>
                </Box>
              </Box>
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
                <Typography variant="body2">
                  {pointsToNextReward} more for 10% discount
                </Typography>
                <Box sx={{ mt: 1, width: '100%', height: 4, bgcolor: '#f0f0f0', borderRadius: 2 }}>
                  <Box sx={{ width: `${(loyaltyPoints / 250) * 100}%`, height: '100%', bgcolor: '#FF6384', borderRadius: 2 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" gutterBottom color="textSecondary">Discount</Typography>
                  <LocalOfferIcon color="primary" />
                </Box>
                <Typography variant="h4" fontWeight="bold">{loyaltyDiscountPercent}%</Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  color="primary" 
                  startIcon={<LocalOfferIcon />}
                  onClick={() => navigate("/offers")}
                  sx={{ mt: 1 }}
                >
                  See All Offers
                </Button>
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
                onClick={() => navigate(`/category/${category.name.toLowerCase()}`)}
              >
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ mb: 1 }}>{category.icon}</Typography>
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
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Cuisine Preferences</Typography>
                <Box sx={{ height: 240 }}>
                  <Pie data={pieData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Order Frequency</Typography>
                <Box sx={{ height: 240 }}>
                  <Line data={lineData} options={chartOptions} />
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
                  <Button 
                    size="small" 
                    onClick={() => navigate("/favorites")}
                    startIcon={<BookmarkIcon />}
                  >
                    View All
                  </Button>
                </Box>
                <List disablePadding>
                  {favoriteItems.map((item) => (
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
                          src={item.image} 
                          alt={item.name}
                          sx={{ width: 48, height: 48, mr: 2 }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body1" fontWeight="medium">{item.name}</Typography>
                          <Typography variant="body2" color="textSecondary">{item.restaurant}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body1" fontWeight="bold">Rs. {item.price}</Typography>
                          <Button 
                            size="small" 
                            variant="contained" 
                            color="primary"
                            sx={{ mt: 0.5, minWidth: 0, px: 1.5 }}
                          >
                            + Add
                          </Button>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
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
                  <Button variant="contained" color="primary" onClick={() => navigate("/offers")}>
                    View Offer Details
                  </Button>
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
      </Box>
    </Box>
  );
};

export default Dashboard;
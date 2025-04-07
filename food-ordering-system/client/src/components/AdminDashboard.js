import React, { useState, useEffect } from "react";
import { 
  Button, Box, Typography, Grid, TextField, IconButton, 
  Menu, MenuItem, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody, Paper, 
  List, ListItem, ListItemText, Avatar, Badge, useTheme, useMediaQuery
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import { Pie, Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from "chart.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar"; // Import the AdminSidebar component

axios.defaults.baseURL = "http://localhost:5000"; // Ensure this matches your server's base URL

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "admin@example.com";
  const [recentUsers, setRecentUsers] = useState([]);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New user registered", time: "10 min ago" },
    { id: 2, message: "New order received", time: "30 min ago" },
    { id: 3, message: "Payment confirmed", time: "1 hour ago" }
  ]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    document.title = "Food Admin Dashboard";
    fetchRecentUsers();
    fetchRecentCustomers();
    fetchRecentOrders(); // Fetch recent orders
  }, []);

  const fetchRecentUsers = async () => {
    try {
      // Replace with actual API call
      setRecentUsers([
        { email: "user1@example.com", date: new Date(2025, 2, 22) },
        { email: "user2@example.com", date: new Date(2025, 2, 21) },
        { email: "user3@example.com", date: new Date(2025, 2, 20) },
        { email: "user4@example.com", date: new Date(2025, 2, 19) }
      ]);
    } catch (error) {
      console.error("Failed to fetch recent users:", error);
    }
  };

  // Fetch recent customers
  const fetchRecentCustomers = async () => {
    try {
      const response = await axios.get("/api/recent-users");
      setRecentCustomers(response.data);
    } catch (error) {
      console.error("Failed to fetch recent customers:", error);
    }
  };

  // Fetch recent orders
  const fetchRecentOrders = async () => {
    try {
      const response = await axios.get("/api/recent-orders");
      setRecentOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch recent orders:", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  // Chart Data
  const pieData = {
    labels: ["Delivery Orders", "Pickup Orders", "Dine-in"],
    datasets: [{ 
      data: [65, 25, 10], 
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      borderColor: ["#fff", "#fff", "#fff"],
      borderWidth: 2
    }]
  };

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ 
      label: "Daily Orders", 
      data: [65, 59, 80, 81, 90, 110, 120], 
      backgroundColor: "#FF6384",
      borderRadius: 6
    }]
  };

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      { 
        label: "Revenue", 
        data: [10000, 15000, 13000, 17000], 
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.1)",
        fill: true,
        tension: 0.4
      },
      { 
        label: "Orders", 
        data: [500, 600, 550, 700], 
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = { 
    responsive: true, 
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#f7f8fc', minHeight: '100vh' }}>
      {/* AdminSidebar Component */}
      <AdminSidebar 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        handleLogout={handleLogout} 
      />

      {/* Main content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 3 }, 
          width: { xs: '100%', md: 'calc(100% - 280px)' },
          ml: { xs: 0, md: '0' }
        }}
      >
        {/* Top bar */}
        <Box 
          sx={{ 
            display: 'flex', 
            mb: 4, 
            alignItems: 'center', 
            justifyContent: 'space-between',
            backgroundColor: '#fff',
            borderRadius: 2,
            p: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}
        >
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
            <Typography variant="h5" fontWeight="bold" color="#1a1a2e">Food Admin Dashboard</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: '#f5f5f5', 
                borderRadius: 20, 
                px: 2, 
                py: 1,
                mr: 1,
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              <SearchIcon color="action" />
              <TextField 
                variant="standard" 
                placeholder="Search..." 
                InputProps={{ disableUnderline: true }} 
                sx={{ ml: 1, minWidth: 120 }}
              />
            </Box>
            
            <IconButton onClick={handleNotificationClick} sx={{ position: 'relative' }}>
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: '#f5f5f5', 
                borderRadius: 20, 
                p: 0.5,
                cursor: 'pointer'
              }}
              onClick={handleProfileClick}
            >
              <Avatar sx={{ backgroundColor: '#FF6384', width: 32, height: 32 }}>
                {userEmail?.charAt(0).toUpperCase() || 'A'}
              </Avatar>
              <Typography variant="body2" sx={{ ml: 1, mr: 1, display: { xs: 'none', sm: 'block' } }}>
                {userEmail || 'Admin'}
              </Typography>
              <IconButton size="small" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <MenuIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseProfileMenu}
          sx={{ mt: 1 }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem sx={{ minWidth: 150 }}>Profile</MenuItem>
          <MenuItem>Account Settings</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
          sx={{ mt: 1 }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem sx={{ backgroundColor: '#f5f5f5', minWidth: 250 }}>
            <Typography variant="subtitle2" fontWeight="bold">Notifications</Typography>
          </MenuItem>
          {notifications.map(notification => (
            <MenuItem key={notification.id} sx={{ py: 1.5 }}>
              <Box>
                <Typography variant="body2">{notification.message}</Typography>
                <Typography variant="caption" color="text.secondary">{notification.time}</Typography>
              </Box>
            </MenuItem>
          ))}
          <MenuItem sx={{ justifyContent: 'center' }}>
            <Typography variant="body2" color="primary">View all notifications</Typography>
          </MenuItem>
        </Menu>

        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" color="#1a1a2e">Welcome back!</Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your restaurant today.
          </Typography>
        </Box>

        {/* Stats cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderRadius: '0 0 0 100%', backgroundColor: 'rgba(255, 99, 132, 0.1)' }} />
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Total Orders</Typography>
                <Typography variant="h4" fontWeight="bold">1,243</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                    +12%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>vs last week</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderRadius: '0 0 0 100%', backgroundColor: 'rgba(54, 162, 235, 0.1)' }} />
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Revenue</Typography>
                <Typography variant="h4" fontWeight="bold">Rs.24,500</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                    +8%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>vs last week</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderRadius: '0 0 0 100%', backgroundColor: 'rgba(255, 206, 86, 0.1)' }} />
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Customers</Typography>
                <Typography variant="h4" fontWeight="bold">5,847</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                    +18%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>vs last month</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderRadius: '0 0 0 100%', backgroundColor: 'rgba(75, 192, 192, 0.1)' }} />
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Avg. Order Value</Typography>
                <Typography variant="h4" fontWeight="bold">Rs.230</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                    +5%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>vs last month</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts & Analytics */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#1a1a2e' }}>Order Analytics</Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">Revenue & Orders</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined" sx={{ borderRadius: 20, textTransform: 'none' }}>Weekly</Button>
                    <Button size="small" variant="contained" sx={{ borderRadius: 20, bgcolor: '#FF6384', textTransform: 'none' }}>Monthly</Button>
                  </Box>
                </Box>
                <Box sx={{ height: 300 }}>
                  <Line data={lineData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Order Distribution</Typography>
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Pie data={pieData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Daily Order Volume</Typography>
                <Box sx={{ height: 250 }}>
                  <Bar data={barData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">Popular Items</Typography>
                  <Button size="small" sx={{ textTransform: 'none', color: '#FF6384' }}>View All</Button>
                </Box>
                <List disablePadding>
                  {[
                    { name: "Butter Chicken", orders: 125, price: "Rs.320" },
                    { name: "Veg Biryani", orders: 98, price: "Rs.280" },
                    { name: "Masala Dosa", orders: 87, price: "Rs.150" },
                    { name: "Paneer Tikka", orders: 76, price: "Rs.220" },
                  ].map((item, index) => (
                    <ListItem 
                      key={index} 
                      sx={{ 
                        px: 0, 
                        py: 1.5, 
                        borderBottom: index < 3 ? '1px solid #f0f0f0' : 'none',
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: 1, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          backgroundColor: `rgba(${index * 50}, ${255 - index * 30}, ${150 + index * 20}, 0.1)`,
                          mr: 2
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">#{index + 1}</Typography>
                      </Box>
                      <ListItemText 
                        primary={item.name}
                        secondary={`${item.orders} orders`}
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                      <Typography variant="body2" fontWeight="bold">{item.price}</Typography>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Tables */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={7}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">Recent Orders</Typography>
                  <Button size="small" sx={{ textTransform: 'none', color: '#FF6384' }}>View All</Button>
                </Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.order_id}>
                        <TableCell>{`#ORD-${order.order_id}`}</TableCell>
                        <TableCell>{order.customer_name}</TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{`Rs.${order.total_amount}`}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={5}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">Recent Customers</Typography>
                  <Button size="small" sx={{ textTransform: 'none', color: '#FF6384' }}>View All</Button>
                </Box>
                <List>
                  {recentCustomers.map((customer, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1.5, borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none' }}>
                      <Avatar sx={{ mr: 2, backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}` }}>
                        {customer.email.charAt(0).toUpperCase()}
                      </Avatar>
                      <ListItemText 
                        primary={customer.email.split('@')[0]}
                        secondary={new Date(customer.created_at).toLocaleDateString()} 
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: 'center', py: 3 }}>
          <Typography variant="body2" color="text.secondary">
            © 2025 YOO!!! Food Ordering Admin Panel. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
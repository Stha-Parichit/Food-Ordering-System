import React, { useState, useEffect } from 'react';
import { 
  Button, Box, Typography, Grid, TextField, IconButton, 
  Menu, MenuItem, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody, Paper, 
  List, ListItem, ListItemText, Avatar, Drawer, ListItemIcon, Divider, Badge,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import { Pie, Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from "chart.js";
import { useNavigate, Link } from "react-router-dom";
import { FaHome, FaThList, FaChartBar, FaUser } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");
  const [recentOrders, setRecentOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const drawerWidth = 240;

  const monthlyData = [
    { month: 'Jan', orders: 20, amount: 10000 },
    { month: 'May', orders: 40, amount: 8000 },
    { month: 'Aug', orders: 50, amount: 10000 },
    { month: 'Dec', orders: 40, amount: 8000 }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  useEffect(() => {
    document.title = "User Dashboard";
    // You can add actual API calls here if needed
    setRecentOrders([
      { id: "#101", date: "Mar 15, 2025", items: 3, amount: 450 },
      { id: "#102", date: "Mar 10, 2025", items: 1, amount: 150 },
      { id: "#103", date: "Mar 5, 2025", items: 2, amount: 300 },
    ]);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
    labels: ["Food", "Donations", "Others"],
    datasets: [{ data: [15000, 5000, 3000], backgroundColor: ["#8b5cf6", "#3b82f6", "#10b981"] }]
  };

  const lineData = {
    labels: ["Jan", "May", "Aug", "Dec"],
    datasets: [{ 
      label: "Orders", 
      data: [20, 40, 50, 40], 
      borderColor: "#10b981", 
      fill: false 
    }]
  };

  const chartOptions = { responsive: true, maintainAspectRatio: false };

  // const drawer = (
  //   <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
  //     <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
  //       <img src="/images/logo.png" alt="Logo" style={{ width: 40, height: 40 }} />
  //       <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>
  //         YOO!!!
  //       </Typography>
  //     </Box>
  //     <Box sx={{ flexGrow: 1, p: 2 }}>
  //       <List>
  //         <ListItem button onClick={() => navigate("/home")} sx={{ borderRadius: 2, mb: 1 }}>
  //           <ListItemIcon>
  //             <HomeIcon />
  //           </ListItemIcon>
  //           <ListItemText primary="Home" />
  //         </ListItem>
  //         <ListItem button selected sx={{ borderRadius: 2, mb: 1, backgroundColor: '#8b5cf6', color: 'white' }}>
  //           <ListItemIcon>
  //             <DashboardIcon sx={{ color: 'white' }} />
  //           </ListItemIcon>
  //           <ListItemText primary="Dashboard" />
  //         </ListItem>
  //         <ListItem button onClick={() => navigate("/categories")} sx={{ borderRadius: 2, mb: 1 }}>
  //           <ListItemIcon>
  //             <RestaurantIcon />
  //           </ListItemIcon>
  //           <ListItemText primary="Categories" />
  //         </ListItem>
  //         <ListItem button onClick={() => navigate("/orders")} sx={{ borderRadius: 2, mb: 1 }}>
  //           <ListItemIcon>
  //             <ReceiptIcon />
  //           </ListItemIcon>
  //           <ListItemText primary="My Orders" />
  //         </ListItem>
  //         <ListItem button onClick={() => navigate("/cart")} sx={{ borderRadius: 2, mb: 1 }}>
  //           <ListItemIcon>
  //             <ShoppingCartIcon />
  //           </ListItemIcon>
  //           <ListItemText primary="Cart" />
  //         </ListItem>
  //         <ListItem button onClick={() => navigate("/settings")} sx={{ borderRadius: 2, mb: 1 }}>
  //           <ListItemIcon>
  //             <SettingsIcon />
  //           </ListItemIcon>
  //           <ListItemText primary="Settings" />
  //         </ListItem>
  //       </List>
  //     </Box>
  //     <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
  //       <List>
  //         <ListItem button onClick={handleLogout} sx={{ borderRadius: 2 }}>
  //           <ListItemIcon>
  //             <LogoutIcon />
  //           </ListItemIcon>
  //           <ListItemText primary="Logout" />
  //         </ListItem>
  //       </List>
  //     </Box>
  //   </Box>
  // );

  const sidebarItems = [
      { text: 'Home', icon: <FaHome />, link: '/home' },
      { text: 'Categories', icon: <FaThList />, link: '/categories' },
      { text: 'Dashboard', icon: <FaChartBar />, link: '/dashboard' },
      { text: 'Profile', icon: <FaUser />, link: '/profile' },
    ];
  
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f7' }}>
        {/* Permanent Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
              backgroundColor: '#1a1a2e',
              color: '#fff'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
            <img src="/images/logo.png" alt="Logo" style={{ width: 40, height: 40 }} />
            <Typography variant="h5" sx={{ ml: 2, fontWeight: 'bold', color: '#fff' }}>
              YOO!!!
            </Typography>
          </Box>
          <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <List>
            {sidebarItems.map((item) => (
              <ListItem 
                button 
                key={item.text} 
                component={Link} 
                to={item.link}
                sx={{ 
                  color: '#fff',
                  '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderLeft: '4px solid #ff9800'
                  },
                  ...(window.location.pathname === item.link && {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderLeft: '4px solid #ff9800'
                  })
                }}
              >
                <ListItemIcon sx={{ color: '#ff9800' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ marginTop: 'auto', padding: 2 }}>
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleLogout}
              sx={{ 
                backgroundColor: '#ff9800',
                '&:hover': { backgroundColor: '#f57c00' }
              }}
            >
              Logout
            </Button>
          </Box>
        </Drawer>
  
        {/* Mobile Sidebar */}
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={toggleSidebar}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
              backgroundColor: '#1a1a2e',
              color: '#fff'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src="/images/logo.png" alt="Logo" style={{ width: 40, height: 40 }} />
              <Typography variant="h5" sx={{ ml: 2, fontWeight: 'bold', color: '#fff' }}>
                YOO!!!
              </Typography>
            </Box>
            <IconButton onClick={toggleSidebar} sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <List>
            {sidebarItems.map((item) => (
              <ListItem 
                button 
                key={item.text} 
                component={Link} 
                to={item.link}
                onClick={toggleSidebar}
                sx={{ 
                  color: '#fff',
                  '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderLeft: '4px solid #ff9800'
                  },
                  ...(window.location.pathname === item.link && {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderLeft: '4px solid #ff9800'
                  })
                }}
              >
                <ListItemIcon sx={{ color: '#ff9800' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ marginTop: 'auto', padding: 2 }}>
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleLogout}
              sx={{ 
                backgroundColor: '#ff9800',
                '&:hover': { backgroundColor: '#f57c00' }
              }}
            >
              Logout
            </Button>
          </Box>
        </Drawer>
      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        {/* Top bar */}
        <Box sx={{ display: 'flex', mb: 4, alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" fontWeight="bold">My Dashboard</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleNotificationClick} sx={{ mr: 1 }}>
              <Badge badgeContent={2} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton onClick={() => navigate("/cart")} sx={{ mr: 1 }}>
              <Badge badgeContent={3} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 40, p: 1 }}>
              <Avatar sx={{ backgroundColor: '#8b5cf6', width: 32, height: 32 }}>
                {userEmail?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Typography variant="body1" sx={{ ml: 1, mr: 1 }}>
                {userEmail || 'User'}
              </Typography>
              <IconButton size="small" onClick={handleProfileClick}>
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
        >
          <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
          sx={{ mt: 1 }}
        >
          <MenuItem disabled>Notifications</MenuItem>
          <MenuItem>Your order #103 has been delivered</MenuItem>
          <MenuItem>New menu items are available!</MenuItem>
        </Menu>

        {/* Stats cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%', background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}>
              <CardContent sx={{ p: 3, color: 'white' }}>
                <Typography variant="h6" gutterBottom>Total Spent</Typography>
                <Typography variant="h4" fontWeight="bold">Rs. 60,000</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>+12% from last month</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="textSecondary">Total Orders</Typography>
                <Typography variant="h4" fontWeight="bold">50</Typography>
                <Typography variant="body2" color="green">+8% from last month</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="textSecondary">Donations</Typography>
                <Typography variant="h4" fontWeight="bold">Rs. 15,000</Typography>
                <Typography variant="body2" color="green">+15% from last month</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="textSecondary">Loyalty Stamps</Typography>
                <Typography variant="h4" fontWeight="bold">8</Typography>
                <Typography variant="body2" color="green">2 more for free meal</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>My Activity Overview</Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Spending Breakdown</Typography>
                <Box sx={{ height: 300 }}>
                  <Pie data={pieData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Order Activity</Typography>
                <Box sx={{ height: 300 }}>
                  <Line data={lineData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Orders and Monthly Performance */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Recent Orders</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell>Rs. {order.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Monthly Performance</Typography>
                <List>
                  {monthlyData.map((data, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1 }}>
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body1">{data.month}</Typography>
                          <Typography variant="body1">Rs. {data.amount}</Typography>
                        </Box>
                        <Box sx={{ width: '100%', height: 8, backgroundColor: '#f0f0f0', borderRadius: 4 }}>
                          <Box 
                            sx={{ 
                              width: `${(data.orders / 50) * 100}%`, 
                              height: '100%', 
                              bgcolor: '#8b5cf6',
                              borderRadius: 4
                            }} 
                          />
                        </Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          {data.orders} orders
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ mt: 6, p: 3, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="body2" color="textSecondary">© YOO!!! All Rights Reserved</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Disclaimer: This site is only for ordering and learning to cook food.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
import React, { useState, useEffect } from "react";
import { 
  Button, Box, Typography, Grid, TextField, IconButton, 
  Menu, MenuItem, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody, Paper, 
  List, ListItem, ListItemText, Avatar, Drawer, ListItemIcon, Divider, Badge
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import { Pie, Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from "chart.js";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const AdminDashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");
  const [recentUsers, setRecentUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const drawerWidth = 240;

  useEffect(() => {
    document.title = "Admin Dashboard";
    fetchRecentUsers();
  }, []);

  const fetchRecentUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/recent-users");
      setRecentUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch recent users:", error);
    }
  };

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
    labels: ["Donations", "Users", "Meals Served"],
    datasets: [{ data: [400000, 50000, 60000], backgroundColor: ["#8b5cf6", "#3b82f6", "#10b981"] }]
  };

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [{ label: "Revenue", data: [450000, 480000, 500000, 530000], backgroundColor: "#8b5cf6" }]
  };

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{ label: "User Growth", data: [1000, 1500, 3000, 5000], borderColor: "#10b981", fill: false }]
  };

  const chartOptions = { responsive: true, maintainAspectRatio: false };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <img src="/images/logo.png" alt="Logo" style={{ width: 40, height: 40 }} />
        <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>
          YOO!!!
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <List>
          <ListItem button selected sx={{ borderRadius: 2, mb: 1, backgroundColor: '#8b5cf6', color: 'white' }}>
            <ListItemIcon>
              <DashboardIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
            <ListItem button sx={{ borderRadius: 2, mb: 1 }}onClick={() => navigate("/upload-item")}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Upload" />
            </ListItem>
          <ListItem button sx={{ borderRadius: 2, mb: 1 }}>
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary="Transactions" />
          </ListItem>
          <ListItem button sx={{ borderRadius: 2, mb: 1 }}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Box>
      <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <List>
          <ListItem button onClick={handleLogout} sx={{ borderRadius: 2 }}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(0, 0, 0, 0.12)' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

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
            <Typography variant="h5" fontWeight="bold">Admin Dashboard</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleNotificationClick} sx={{ mr: 1 }}>
              <Badge badgeContent={2} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 40, p: 1 }}>
              <Avatar sx={{ backgroundColor: '#8b5cf6', width: 32, height: 32 }}>
                {userEmail?.charAt(0).toUpperCase() || 'A'}
              </Avatar>
              <Typography variant="body1" sx={{ ml: 1, mr: 1 }}>
                {userEmail || 'Admin'}
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
          <MenuItem>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
          sx={{ mt: 1 }}
        >
          <MenuItem disabled>Notifications</MenuItem>
          <MenuItem>New user registered</MenuItem>
          <MenuItem>Payment received</MenuItem>
        </Menu>

        {/* Stats cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%', background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}>
              <CardContent sx={{ p: 3, color: 'white' }}>
                <Typography variant="h6" gutterBottom>Total Revenue</Typography>
                <Typography variant="h4" fontWeight="bold">Rs. 1,960,000</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>+8% from last month</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="textSecondary">New Users</Typography>
                <Typography variant="h4" fontWeight="bold">5,000</Typography>
                <Typography variant="body2" color="green">+12% from last month</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="textSecondary">Transactions</Typography>
                <Typography variant="h4" fontWeight="bold">12,456</Typography>
                <Typography variant="body2" color="green">+5% from last month</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="textSecondary">Donations</Typography>
                <Typography variant="h4" fontWeight="bold">Rs. 400,000</Typography>
                <Typography variant="body2" color="green">+15% from last month</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>Impact & Revenue Overview</Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Donations & Users</Typography>
                <Box sx={{ height: 300 }}>
                  <Pie data={pieData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Revenue</Typography>
                <Box sx={{ height: 300 }}>
                  <Bar data={barData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>User Growth</Typography>
                <Box sx={{ height: 300 }}>
                  <Line data={lineData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Users and Transactions */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Recent Users</Typography>
                <List>
                  {[1, 2, 3, 4].map((_, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1 }}>
                      <Avatar sx={{ mr: 2, backgroundColor: '#8b5cf6' }}>
                        {String.fromCharCode(65 + index)}
                      </Avatar>
                      <ListItemText 
                        primary={`user${index + 1}@example.com`} 
                        secondary={new Date(2025, 2, 19 - index).toLocaleDateString()} 
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Recent Transactions</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow><TableCell>#101</TableCell><TableCell>John Doe</TableCell><TableCell>Rs.50</TableCell><TableCell><span style={{ color: 'green' }}>Completed</span></TableCell></TableRow>
                    <TableRow><TableCell>#102</TableCell><TableCell>Jane Smith</TableCell><TableCell>Rs.75</TableCell><TableCell><span style={{ color: 'orange' }}>Pending</span></TableCell></TableRow>
                    <TableRow><TableCell>#103</TableCell><TableCell>Alice Brown</TableCell><TableCell>Rs.100</TableCell><TableCell><span style={{ color: 'red' }}>Refunded</span></TableCell></TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
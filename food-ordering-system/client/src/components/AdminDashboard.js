import React, { useState, useEffect } from "react";
import { 
  Button, Box, Typography, Grid, TextField, AppBar, Toolbar, IconButton, 
  Menu, MenuItem, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody, Paper, Link, 
  List, ListItem, ListItemText, Avatar 
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { FaBell } from "react-icons/fa";
import { Pie, Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from "chart.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const AdminDashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };
  
  // Profile Dropdown Handlers
  const handleClickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
    const [notifications, setNotifications] = useState([]);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
    const handleNotificationClick = (event) => {
      setNotificationAnchorEl(event.currentTarget);
    };
  
    const handleNotificationClose = () => {
      setNotificationAnchorEl(null);
    };

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

  // Chart Data
  const pieData = {
    labels: ["Donations", "Users", "Meals Served"],
    datasets: [{ data: [400000, 50000, 60000], backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"] }]
  };

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [{ label: "Revenue", data: [450000, 480000, 500000, 530000], backgroundColor: "#007BFF" }]
  };

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [{ label: "User Growth", data: [1000, 1500, 3000, 5000], borderColor: "#4CAF50", fill: false }]
  };

  const chartOptions = { responsive: true, maintainAspectRatio: false };

  const [recentUsers, setRecentUsers] = useState([]);

  return (
    <div>
      <AppBar position="sticky" sx={{ backgroundColor: "#fff", color: "#333" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src="/images/logo.png" alt="Logo" style={{ width: 40, height: 40 }} />
            <Typography variant="h6" sx={{ ml: 2, color: "#333" }}>
              YOO!!!
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mx: "auto" }}>
            <Button sx={{ color: "#333" }} component="a" href="/home">
              Home
            </Button>
            <Button sx={{ color: "#333" }} component="a" href="/categories">
              Categories
            </Button>
            <Button sx={{ color: "#333" }} component="a" href="/dashboard">
              Dashboard
            </Button>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={handleNotificationClick}>
              <FaBell style={{ fontSize: "1.5rem", color: "#333" }} />
            </IconButton>
            <IconButton onClick={handleClickProfile}>
              <AccountCircleIcon sx={{ fontSize: "2rem", color: "#333" }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseProfileMenu}
              sx={{ mt: 2 }}
            >
              <MenuItem>{userEmail}</MenuItem>
              <Link to="/profile" style={{ textDecoration: "none", color: "black" }}>
                <MenuItem>Profile</MenuItem>
              </Link>
              <MenuItem onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("userEmail"); navigate("/login"); }}>
                Logout
              </MenuItem>
            </Menu>
            <Menu
              anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationClose}
              sx={{ mt: 2 }}
            >
              <MenuItem disabled>Notifications</MenuItem>
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <MenuItem key={index}>{notification.message}</MenuItem>
                ))
              ) : (
                <MenuItem>No notifications</MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" textAlign="center" mb={3}>Impact & Revenue Overview</Typography>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Donations & Users</Typography>
                <Box sx={{ height: 300 }}>
                  <Pie data={pieData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Revenue</Typography>
                <Box sx={{ height: 300 }}>
                  <Bar data={barData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">User Growth</Typography>
                <Box sx={{ height: 300 }}>
                  <Line data={lineData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Users */}
        <Typography variant="h5" mt={4}>Recent Users</Typography>
      <Paper sx={{ p: 2 }}>
        <List>
          {recentUsers.map((user, index) => (
            <ListItem key={index}>
              <Avatar sx={{ mr: 2 }}>
                {user.email.charAt(0).toUpperCase()}
              </Avatar>
              <ListItemText primary={user.email} secondary={new Date(user.created_at).toLocaleDateString()} />
            </ListItem>
          ))}
        </List>
      </Paper>

        {/* Recent Transactions */}
        <Typography variant="h5" mt={4}>Recent Transactions</Typography>
        <Table component={Paper}>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow><TableCell>#101</TableCell><TableCell>John Doe</TableCell><TableCell>$50</TableCell><TableCell>Completed</TableCell></TableRow>
            <TableRow><TableCell>#102</TableCell><TableCell>Jane Smith</TableCell><TableCell>$75</TableCell><TableCell>Pending</TableCell></TableRow>
            <TableRow><TableCell>#103</TableCell><TableCell>Alice Brown</TableCell><TableCell>$100</TableCell><TableCell>Refunded</TableCell></TableRow>
          </TableBody>
        </Table>
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: "center", mt: 5, p: 3, backgroundColor: "#f0f0f0" }}>
        <Typography variant="body2">© YOO!!! All Rights Reserved</Typography>
        <Typography variant="body2">🍴 YOO!!!</Typography>
        <Typography variant="body2">Disclaimer: This site is only for ordering and learning to cook food.</Typography>
      </Box>
    </div>
  );
};

export default AdminDashboard;

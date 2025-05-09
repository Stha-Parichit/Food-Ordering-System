import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody, 
  Button, Chip, Avatar, Divider, IconButton, Paper, AppBar, Toolbar, Badge, Tab, Tabs,
  LinearProgress, List, ListItem, ListItemText, ListItemAvatar, ListItemSecondary, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, Snackbar,
  TableContainer,
  DialogContentText,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { 
  RestaurantMenu as RestaurantMenuIcon,
  Notifications as NotificationsIcon, 
  PersonOutline as PersonOutlineIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as AttachMoneyIcon,
  CheckCircle as CheckCircleIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from "chart.js";
import ChefSidebar from './ChefSidebar';
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#ec7211', // Chef-themed orange/amber
      light: '#ffac42',
      dark: '#b64f00',
      contrastText: '#fff',
    },
    secondary: {
      main: '#2e7d32', // Complementary green
      light: '#60ad5e',
      dark: '#005005',
      contrastText: '#fff',
    },
    background: {
      default: '#f9f7f3', // Warm neutral background
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
          borderRadius: 12,
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        }
      }
    }
  }
});

// Styled components
const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  '&:last-child': {
    paddingBottom: theme.spacing(3)
  }
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  let color = theme.palette.primary.main;
  let bgColor = theme.palette.primary.light + '20'; // 20% opacity
  
  if (status === 'Completed' || status === 'Ready') {
    color = theme.palette.secondary.main;
    bgColor = theme.palette.secondary.light + '20';
  } else if (status === 'Cancelled') {
    color = theme.palette.error.main;
    bgColor = theme.palette.error.light + '20';
  }
  
  return {
    backgroundColor: bgColor,
    color: color,
    fontWeight: 600,
    '& .MuiChip-label': {
      padding: '0 12px',
    }
  };
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light + '30',
  color: theme.palette.primary.dark,
  width: 48,
  height: 48
}));

// Add API base URL
const API_BASE_URL = 'http://localhost:5000';

const ChefDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeOrders, setActiveOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [performanceStats, setPerformanceStats] = useState({ totalOrders: 0, totalEarnings: 0 });
  const [currentTab, setCurrentTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const ORDERS_TO_SHOW = 4; // Number of orders to show initially
  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Status options array
  const statusOptions = [
    "Order Placed",
    "Cooking",
    "Prepared for Delivery",
    "Off for Delivery",
    "Delivered",
    "Cancelled"
  ];

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    document.title = "Chef Dashboard";
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch performance stats
      const statsResponse = await fetch(`${API_BASE_URL}/chef/orders/stats`);
      if (!statsResponse.ok) {
        throw new Error(`HTTP error! status: ${statsResponse.status}`);
      }
      const statsData = await statsResponse.json();
      setPerformanceStats({
        totalOrders: statsData.totalOrders || 0,
        totalEarnings: statsData.totalEarnings || 0,
        completed: Math.floor(statsData.completedOrders) || 0,
        completionRate: ((statsData.completedOrders || 0) / (statsData.totalOrders || 1) * 100).toFixed(0)
      });

      // Fetch active orders (excluding delivered)
      const activeOrdersResponse = await fetch(`${API_BASE_URL}/chef/orders?status=active`);
      if (!activeOrdersResponse.ok) {
        throw new Error(`HTTP error! status: ${activeOrdersResponse.status}`);
      }
      const activeOrdersData = await activeOrdersResponse.json();

      // Filter out delivered orders
      const filteredActiveOrders = activeOrdersData.filter(order => 
        order.status !== 'Delivered' && order.status !== 'Cancelled'
      );

      setActiveOrders(filteredActiveOrders.map(order => ({
        id: order.id,
        customer_name: order.customer_name,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,
        items: order.items ? order.items.map(item => item.food_name || 'Unnamed Item') : []
      })));

      // Fetch recent orders (only in-progress)
      const recentOrdersResponse = await fetch(`${API_BASE_URL}/chef/orders?status=recent`);
      if (!recentOrdersResponse.ok) {
        throw new Error(`HTTP error! status: ${recentOrdersResponse.status}`);
      }
      const recentOrdersData = await recentOrdersResponse.json();

      // Filter out delivered and cancelled orders from recent orders
      const filteredRecentOrders = recentOrdersData.filter(order => 
        order.status !== 'Delivered' && order.status !== 'Cancelled'
      );

      setRecentOrders(filteredRecentOrders.map(order => ({
        id: order.id,
        customer_name: order.customer_name,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at
      })));

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(`Failed to load dashboard data: ${err.message}`);
      setActiveOrders([]);
      setRecentOrders([]);
      setPerformanceStats({ totalOrders: 0, totalEarnings: 0, completed: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayedOrders = (orders) => {
    return showAllOrders ? orders : orders.slice(0, ORDERS_TO_SHOW);
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "Orders Completed",
      data: [20, 25, 30, 35, 40, 45],
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.main + '20',
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
      },
      tooltip: {
        backgroundColor: '#424242',
        titleColor: '#fff',
        bodyColor: '#fff',
        bodyFont: {
          family: theme.typography.fontFamily
        },
        titleFont: {
          family: theme.typography.fontFamily
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !selectedStatus) {
      setSnackbar({ open: true, message: "Please select an order and status.", severity: "error" });
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/api/orders/${selectedOrder.id}/status`, {
        status: selectedStatus
      });

      if (response.status === 200) {
        // Update local state
        const updatedOrders = activeOrders.map(order =>
          order.id === selectedOrder.id ? { ...order, status: selectedStatus } : order
        );
        setActiveOrders(updatedOrders);
        setStatusUpdateDialogOpen(false);
        setSnackbar({
          open: true,
          message: `Order #${selectedOrder.id} status updated to ${selectedStatus}`,
          severity: "success"
        });
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update order status",
        severity: "error"
      });
    }
  };

  const handleViewDetails = async (order) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/${order.id}`);
      setOrderDetails(response.data);
      setDetailsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch order details",
        severity: "error"
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
        <Typography color="error" align="center">
          {error}
          <Button 
            variant="contained" 
            sx={{ mt: 2, display: 'block', mx: 'auto' }}
            onClick={fetchDashboardData}
          >
            Retry
          </Button>
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
        <ChefSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <Box component="main" sx={{ flexGrow: 1, p: 0, width: { sm: `calc(100% - 240px)` } }}>
          {/* App Bar */}
          <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
            <Toolbar>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <RestaurantMenuIcon sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
                  Chef Portal
                </Typography>
              </Box>
              
              <Box sx={{ flexGrow: 1 }} />
              
              {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<ShoppingCartIcon />}
                  sx={{ px: 3 }}
                >
                  New Order
                </Button>
                
                <IconButton size="large">
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                
                <Avatar sx={{ bgcolor: 'primary.main', width: 38, height: 38 }}>RS</Avatar>
              </Box> */}
            </Toolbar>
          </AppBar>
          
          <Box sx={{ p: 3 }}>
            {/* Welcome heading */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h5" sx={{ mb: 1 }}>
                  Welcome back, Chef Raj
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Here's what's happening in your kitchen today
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>
              </Box>
            </Box>

            {/* Performance Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <StyledCardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Total Orders</Typography>
                        <Typography variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
                          {performanceStats.totalOrders}
                        </Typography>
                        <Typography variant="body2" color="success.main" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                          <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                          12% from last month
                        </Typography>
                      </Box>
                      <StyledAvatar>
                        <ShoppingCartIcon />
                      </StyledAvatar>
                    </Box>
                  </StyledCardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <StyledCardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Total Earnings</Typography>
                        <Typography variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
                          Rs. {performanceStats.totalEarnings.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="success.main" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                          <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                          8% from last month
                        </Typography>
                      </Box>
                      <StyledAvatar>
                        <AttachMoneyIcon />
                      </StyledAvatar>
                    </Box>
                  </StyledCardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <StyledCardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Orders Completed</Typography>
                        <Typography variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
                          {performanceStats.completed}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={parseInt(performanceStats.completionRate) || 0}
                            sx={{ 
                              height: 8, 
                              width: 80, 
                              borderRadius: 4,
                              bgcolor: 'rgba(0,0,0,0.05)',
                              mr: 1
                            }} 
                          />
                          <Typography variant="body2" color="text.secondary">
                            {performanceStats.completionRate}% rate
                          </Typography>
                        </Box>
                      </Box>
                      <StyledAvatar>
                        <CheckCircleIcon />
                      </StyledAvatar>
                    </Box>
                  </StyledCardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Orders Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Manage Orders</Typography>
              <Paper sx={{ borderRadius: 3 }}>
                <Tabs 
                  value={currentTab} 
                  onChange={handleTabChange}
                  sx={{
                    '& .MuiTabs-indicator': {
                      height: 3,
                      borderRadius: '3px 3px 0 0'
                    },
                    px: 2,
                    pt: 1
                  }}
                >
                  <Tab label="Active Orders" />
                  <Tab label="Recent Orders" />
                </Tabs>
                
                <Divider />
                
                {/* Active Orders Tab */}
                {currentTab === 0 && (
                  <Box sx={{ p: 2 }}>
                    <Grid container spacing={3}>
                      {getDisplayedOrders(activeOrders).map((order) => (
                        <Grid item xs={12} md={6} key={order.id}>
                          <Card 
                            sx={{ 
                              position: 'relative', 
                              overflow: 'visible',
                              ':before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '4px',
                                borderRadius: '4px 4px 0 0',
                                backgroundColor: order.status === 'Ready' ? 'secondary.main' : 'primary.main'
                              }
                            }}
                          >
                            <StyledCardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar 
                                    sx={{ 
                                      bgcolor: order.status === 'Ready' ? 'secondary.light' + '30' : 'primary.light' + '30', 
                                      color: order.status === 'Ready' ? 'secondary.dark' : 'primary.dark', 
                                      mr: 2 
                                    }}
                                  >
                                    {order.customer_name.split(' ').map(n => n[0]).join('')}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                      {order.customer_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      #{order.id} • {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </Typography>
                                  </Box>
                                </Box>
                                <StatusChip 
                                  label={order.status} 
                                  status={order.status} 
                                  size="small"
                                />
                              </Box>

                              <Divider sx={{ my: 2 }} />
                              
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  Order Items
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                  {Array.isArray(order.items) ? order.items.map((item, idx) => (
                                    <Chip 
                                      key={idx} 
                                      label={typeof item === 'string' ? item : 'Unnamed Item'} 
                                      size="small" 
                                      sx={{ 
                                        bgcolor: 'background.default',
                                        color: 'text.primary',
                                        fontWeight: 500
                                      }} 
                                    />
                                  )) : null}
                                </Box>
                              </Box>
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                  <Typography variant="body2" color="text.secondary">Total</Typography>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Rs. {order.total_amount}
                                  </Typography>
                                </Box>
                                <Button 
                                  variant="contained" 
                                  color={order.status === 'Ready' ? 'secondary' : 'primary'}
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setSelectedStatus(order.status);
                                    setStatusUpdateDialogOpen(true);
                                  }}
                                >
                                  Update Status
                                </Button>
                              </Box>
                            </StyledCardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                    {activeOrders.length > ORDERS_TO_SHOW && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => setShowAllOrders(!showAllOrders)}
                        >
                          {showAllOrders ? 'Show Less' : `Show All (${activeOrders.length})`}
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}
                
                {/* Recent Orders Tab */}
                {currentTab === 1 && (
                  <Box>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Order ID</TableCell>
                          <TableCell>Customer</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Total</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getDisplayedOrders(recentOrders).map((order) => (
                          <TableRow key={order.id} hover>
                            <TableCell>#{order.id}</TableCell>
                            <TableCell>{order.customer_name}</TableCell>
                            <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>Rs. {order.total_amount}</TableCell>
                            <TableCell>
                              <StatusChip label={order.status} status={order.status} size="small" />
                            </TableCell>
                            <TableCell>
                              <Button 
                                color="primary" 
                                size="small"
                                onClick={() => handleViewDetails(order)}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {recentOrders.length > ORDERS_TO_SHOW && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => setShowAllOrders(!showAllOrders)}
                        >
                          {showAllOrders ? 'Show Less' : `Show All (${recentOrders.length})`}
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}
              </Paper>
            </Box>

            {/* Performance Chart */}
            {/* <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card>
                  <StyledCardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6">Performance Overview</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="primary" 
                          sx={{ minWidth: 80 }}
                        >
                          Monthly
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="primary" 
                          sx={{ minWidth: 80 }}
                        >
                          Weekly
                        </Button>
                      </Box>
                    </Box>
                    <Box sx={{ height: 280 }}>
                      <Line data={lineData} options={chartOptions} />
                    </Box>
                  </StyledCardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <StyledCardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>Popular Items</Typography>
                    <List sx={{ px: 0 }}>
                      {['Butter Chicken', 'Paneer Tikka', 'Chicken Biryani', 'Malai Kofta'].map((item, index) => (
                        <ListItem 
                          key={index}
                          sx={{ 
                            px: 0, 
                            borderBottom: index < 3 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                            py: 1.5 
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: `rgba(${index * 50}, 120, 180, 0.1)` }}>
                              {index + 1}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary={item} 
                            secondary={`${25 - index * 4} orders this month`}
                          />
                          <Typography color="primary.main" fontWeight={500}>
                            {`Rs. ${(350 - index * 30).toLocaleString()}`}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </StyledCardContent>
                </Card>
              </Grid>
            </Grid> */}
          </Box>
        </Box>
      </Box>

      <Dialog
        open={statusUpdateDialogOpen}
        onClose={() => setStatusUpdateDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Order #{selectedOrder?.id}
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
          <Button onClick={() => setStatusUpdateDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleStatusUpdate} color="primary" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Order Details
          <IconButton
            aria-label="close"
            onClick={() => setDetailsDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {orderDetails && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Order ID</Typography>
                  <Typography variant="h6">#{orderDetails.id}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <StatusChip label={orderDetails.status} status={orderDetails.status} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
                  <Typography variant="body1">
                    {new Date(orderDetails.created_at).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Total Amount</Typography>
                  <Typography variant="h6">Rs. {orderDetails.total_amount}</Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>Order Items</Typography>
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Customization</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderDetails.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              src={item.image_url}
                              variant="rounded"
                              sx={{ width: 40, height: 40 }}
                            />
                            <Typography variant="body2">{item.food_name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>Rs. {item.price}</TableCell>
                        <TableCell>
                          {item.customization && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {Object.entries(item.customization).map(([key, value]) => {
                                if (value === true || (typeof value === 'string' && value.length > 0)) {
                                  return (
                                    <Chip
                                      key={key}
                                      label={key.replace(/([A-Z])/g, ' $1').trim()}
                                      size="small"
                                      sx={{ 
                                        height: 20,
                                        fontSize: '0.75rem',
                                        bgcolor: 'background.default'
                                      }}
                                    />
                                  );
                                }
                                return null;
                              })}
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default ChefDashboard;
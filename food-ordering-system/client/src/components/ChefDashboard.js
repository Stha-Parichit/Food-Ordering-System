import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody, Button, Chip, Avatar, Divider 
} from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import Sidebar from './Sidebar';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const ChefDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeOrders, setActiveOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [performanceStats, setPerformanceStats] = useState({ totalOrders: 0, totalEarnings: 0 });

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    document.title = "Chef Dashboard";

    const fetchOrders = async () => {
      try {
        const [activeResponse, recentResponse, statsResponse] = await Promise.all([
          axios.get("/chef/orders?status=active"),
          axios.get("/chef/orders?status=recent"),
          axios.get("/chef/orders/stats")
        ]);

        setActiveOrders(activeResponse.data);
        setRecentOrders(recentResponse.data);
        setPerformanceStats({
          totalOrders: statsResponse.data.totalOrders || 0,
          totalEarnings: statsResponse.data.totalEarnings || 0
        });
      } catch (error) {
        console.error("Error fetching chef data:", error);
      }
    };

    fetchOrders();
  }, []);

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "Orders Completed",
      data: [20, 25, 30, 35, 40, 45],
      borderColor: "#4caf50",
      backgroundColor: "rgba(76, 175, 80, 0.2)",
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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, width: { sm: `calc(100% - 240px)` } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">Chef Dashboard</Typography>
          <Button variant="contained" color="primary" onClick={() => navigate("/new-order")}>
            Add New Order
          </Button>
        </Box>

        {/* Performance Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Total Orders</Typography>
                <Typography variant="h4" fontWeight="bold">{performanceStats.totalOrders}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Total Earnings</Typography>
                <Typography variant="h4" fontWeight="bold">Rs. {performanceStats.totalEarnings}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Orders Completed</Typography>
                <Typography variant="h4" fontWeight="bold">{performanceStats.totalOrders}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Active Orders */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Active Orders</Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {activeOrders.map((order) => (
            <Grid item xs={12} md={6} key={order.id}>
              <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">Order #{order.id}</Typography>
                    <Chip label={order.status} color="primary" />
                  </Box>
                  <Typography variant="body2">Customer: {order.customer_name}</Typography>
                  <Typography variant="body2">Total: Rs. {order.total_amount}</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Button variant="contained" size="small" onClick={() => navigate(`/order/${order.id}`)}>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Orders */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Recent Orders</Typography>
        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id} hover onClick={() => navigate(`/order/${order.id}`)}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>Rs. {order.total_amount}</TableCell>
                    <TableCell>{order.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Typography variant="h6" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>Performance Overview</Typography>
        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Box sx={{ height: 240 }}>
              <Line data={lineData} options={chartOptions} />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ChefDashboard;

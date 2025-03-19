import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import {
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Link
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const orderStages = [
  { id: "received", label: "Order Received", icon: "📦", description: "Restaurant is confirming your order" },
  { id: "preparing", label: "Preparing", icon: "🍳", description: "Chef is preparing your delicious meal" },
  { id: "outForDelivery", label: "Out for Delivery", icon: "🚗", description: "Your order is on its way" },
  { id: "delivered", label: "Delivered", icon: "🎉", description: "Enjoy your meal!" },
];

const Stages = ({ currentStatus }) => {
  const currentIndex = orderStages.findIndex((stage) => stage.id === currentStatus);

  return (
    <Box display="flex" justifyContent="space-evenly" my={2}>
      {orderStages.map((stage, index) => (
        <Box
          key={stage.id}
          display="flex"
          flexDirection="column"
          alignItems="center"
          className={`stage ${stage.id === currentStatus ? "active" : index < currentIndex ? "completed" : ""}`}
        >
          <Typography variant="h6">{stage.icon}</Typography>
          <Typography variant="body2">{stage.label}</Typography>
        </Box>
      ))}
    </Box>
  );
};

const ProgressBar = ({ currentStatus }) => {
  const currentIndex = orderStages.findIndex((stage) => stage.id === currentStatus);
  const progress = ((currentIndex + 1) / orderStages.length) * 100;

  return (
    <Box width="100%" bgcolor="lightgray" borderRadius="10px">
      <Box
        className="progress-value"
        height="8px"
        bgcolor="#2563eb"
        borderRadius="10px"
        width={`${progress}%`}
      />
    </Box>
  );
};

const OrderItems = () => {
  const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
  const selectedCharity = JSON.parse(localStorage.getItem("selectedCharity"));
  const selectedDiscount = JSON.parse(localStorage.getItem("selectedDiscount"));

  const total = savedCart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const charityDonation = selectedCharity ? parseInt(selectedCharity.amount.replace('Rs. ', '')) : 0;
  const loyaltyDiscount = selectedDiscount ? (total * parseInt(selectedDiscount.title) / 100) : 0;
  const deliveryFee = 60;

  const finalTotal = total + charityDonation - loyaltyDiscount + deliveryFee;

  return (
    <Box my={1}>
      <Typography variant="h6" sx={{ marginBottom: 1 }}>
        Order Details
      </Typography>
      {savedCart.map((item, index) => (
        <Box key={index} display="flex" justifyContent="space-between" py={0.5}>
          <Typography variant="body2">{item.name} x {item.quantity}</Typography>
          <Typography variant="body2">Rs. {(item.price * item.quantity).toFixed(2)}</Typography>
        </Box>
      ))}
      <Box display="flex" justifyContent="space-between" py={0.5}>
        <Typography variant="body2">Charity Donation</Typography>
        <Typography variant="body2">Rs. {charityDonation.toFixed(2)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" py={0.5}>
        <Typography variant="body2">Loyalty Discount</Typography>
        <Typography variant="body2">- Rs. {loyaltyDiscount.toFixed(2)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" py={0.5}>
        <Typography variant="body2">Delivery Fee</Typography>
        <Typography variant="body2">Rs. {deliveryFee.toFixed(2)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" py={0.5}>
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6">Rs. {finalTotal.toFixed(2)}</Typography>
      </Box>
    </Box>
  );
};


const OrderTracking = () => {
  const [currentStatus, setCurrentStatus] = useState("received");
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < orderStages.length - 1) {
        currentIndex++;
        setCurrentStatus(orderStages[currentIndex].id);
      } else {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleClickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
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
            <TextField variant="outlined" size="small" placeholder="Search" InputProps={{ endAdornment: <SearchIcon /> }} sx={{ bgcolor: "white", borderRadius: 1, mr: 2 }} />
            <FaBell style={{ fontSize: "1.5rem", color: "#333" }} />
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
          </Box>
        </Toolbar>
      </AppBar>

      <Box padding={3}>
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Order Tracking
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary">
            Order #FO-12345
          </Typography>
        </Paper>

        <Stages currentStatus={currentStatus} />
        <ProgressBar currentStatus={currentStatus} />

        <OrderItems />

        <Box my={3}>
          <Typography variant="body1" color="textSecondary">
            Estimated Delivery: 30-45 minutes
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Delivering from: Pizzeria Delizioso
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" my={3}>
          <Button variant="outlined" color="primary">
            Contact Support
          </Button>
          <Button variant="contained" color="primary" onClick={handleBackToDashboard}>
            Back To Dashboard
          </Button>
        </Box>
      </Box>

      <Box sx={{ textAlign: "center", p: 3, backgroundColor: "#f0f0f0", position: "relative", bottom: 0, left: 0, width: "100%" }}>
        <Typography variant="body2">© YOO!!! All Rights Reserved</Typography>
        <Typography variant="body2">🍴 YOO!!!</Typography>
        <Typography variant="body2">
          Disclaimer: This site is only for ordering and learning to cook food.
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderTracking;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Button, 
  Typography, 
  Container, 
  Box, 
  Paper, 
  Divider,
  Fade,
  Zoom,
  CircularProgress
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import DownloadIcon from "@mui/icons-material/Download"; // Add this import
import axios from "axios"; // Add this import

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const paymentMethod = localStorage.getItem("paymentMethod");
  const [loading, setLoading] = useState(true);
  const [orderNumber] = useState(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
  
  // Simulate loading for a smoother experience
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handleOrdersClick = () => {
    navigate("/orders");
  };

  const handleDownloadReceipt = async () => {
    try {
      const orderId = orderNumber.replace("ORD-", ""); // Extract order ID
      const response = await axios.get(
        `http://localhost:5000/api/charity-receipt/${orderId}`,
        { responseType: "blob" } // Ensure the response is treated as a file
      );

      // Create a link to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `charity_receipt_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading receipt:", error);
      alert("Failed to download receipt. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ 
        mt: 15, 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center" 
      }}>
        <CircularProgress color="success" size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Processing your order...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ my: 8 }}>
      <Zoom in={!loading} timeout={800}>
        <Paper 
          elevation={6} 
          sx={{ 
            padding: 4, 
            borderRadius: 3, 
            textAlign: "center",
            background: "linear-gradient(to bottom, #ffffff, #f9f9f9)",
            border: "1px solid #e0e0e0",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Success indicator */}
          <Box 
            sx={{ 
              position: "absolute", 
              top: 0, 
              left: 0, 
              width: "100%", 
              height: "6px", 
              background: "linear-gradient(to right, #4caf50, #8bc34a)"
            }} 
          />
          
          <Fade in={!loading} timeout={1200}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <CheckCircleIcon 
                color="success" 
                sx={{ 
                  fontSize: 80, 
                  mb: 2,
                  filter: "drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3))"
                }} 
              />
              
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 1, 
                  fontWeight: 600,
                  background: "linear-gradient(45deg, #2e7d32, #4caf50)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                Order Confirmed!
              </Typography>
              
              <Typography 
                variant="subtitle1" 
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                Your order has been successfully placed
              </Typography>
              
              <Divider sx={{ width: "80%", mb: 4 }} />
              
              <Box sx={{ mb: 4, width: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <ConfirmationNumberIcon color="primary" sx={{ mr: 2 }} />
                  <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>
                    Order Number: 
                    <Box component="span" sx={{ ml: 1, color: "#1976d2", fontWeight: 600 }}>
                      {orderNumber}
                    </Box>
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PaymentIcon color="primary" sx={{ mr: 2 }} />
                  <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>
                    Payment Method: 
                    <Box 
                      component="span" 
                      sx={{ 
                        ml: 1, 
                        color: paymentMethod === 'COD' ? '#ff9800' : '#4caf50',
                        fontWeight: 600
                      }}
                    >
                      {paymentMethod === 'COD' ? 'Cash On Delivery' : 'Paid Online'}
                    </Box>
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocalShippingIcon color="primary" sx={{ mr: 2 }} />
                  <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>
                    Estimated Delivery: 
                    <Box component="span" sx={{ ml: 1, color: "#1976d2", fontWeight: 600 }}>
                      {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </Box>
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ width: "80%", mb: 4 }} />
              
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 4, 
                  px: 2,
                  color: "text.secondary",
                  fontStyle: "italic"
                }}
              >
                Thank you for your purchase! We're preparing your order and will notify you when it ships.
              </Typography>
              
              <Box 
                sx={{ 
                  display: "flex", 
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  width: "100%",
                  justifyContent: "center"
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOrdersClick}
                  startIcon={<ConfirmationNumberIcon />}
                  sx={{
                    padding: "10px 24px",
                    fontSize: "15px",
                    textTransform: "none",
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 6px 15px rgba(25, 118, 210, 0.3)",
                      transform: "translateY(-2px)"
                    }
                  }}
                >
                  My Orders
                </Button>
                
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleHomeClick}
                  startIcon={<HomeIcon />}
                  sx={{
                    padding: "10px 24px",
                    fontSize: "15px",
                    textTransform: "none",
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 6px 15px rgba(76, 175, 80, 0.3)",
                      transform: "translateY(-2px)"
                    }
                  }}
                >
                  Continue Shopping
                </Button>

                {/* <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleDownloadReceipt}
                  startIcon={<DownloadIcon />}
                  sx={{
                    padding: "10px 24px",
                    fontSize: "15px",
                    textTransform: "none",
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(156, 39, 176, 0.2)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 6px 15px rgba(156, 39, 176, 0.3)",
                      transform: "translateY(-2px)"
                    }
                  }}
                >
                  Download Receipt
                </Button> */}
              </Box>
            </Box>
          </Fade>
        </Paper>
      </Zoom>
    </Container>
  );
};

export default OrderConfirmation;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Divider,
  Alert,
  AlertTitle,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import jsPDF from "jspdf";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const EsewaPayment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [orderDetails, setOrderDetails] = useState({
    subtotal: 0,
    deliveryFee: 0,
    charityDonation: 0,
    discountAmount: 0,
    total: 0,
  });
  const [formData, setFormData] = useState({
    merchantId: "EPAYTEST",  // eSewa test merchant ID
    amount: 0,
    productId: "",
    productName: "Food Order",
    phoneNumber: "",
    transactionPin: "",
  });
  const [receiptOpen, setReceiptOpen] = useState(false);
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [selectedDiscount, setSelectedDiscount] = useState(JSON.parse(localStorage.getItem("selectedDiscount")) || { title: "0", amount: "0" });

  const apiUrl = "http://localhost:5000";

  useEffect(() => {
    document.title = "eSewa Payment - YOO!!!";
    
    // Generate a unique order ID
    const orderId = `YOO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setFormData(prev => ({ ...prev, productId: orderId }));
    
    // Retrieve cart total from localStorage or recalculate
    const retrieveCartData = () => {
      const deliveryAddress = localStorage.getItem("deliveryAddress");
      const selectedDiscount = JSON.parse(localStorage.getItem("selectedDiscount"));
      const selectedCharity = JSON.parse(localStorage.getItem("selectedCharity"));
      
      if (!deliveryAddress) {
        navigate("/checkout");
        return;
      }
      
      // Either get subtotal from localStorage or fetch cart items
      fetchCartTotal();
    };
    
    retrieveCartData();
  }, [navigate]);
  
  const fetchCartTotal = async () => {
    setLoading(true);
    const userId = localStorage.getItem("user_id");
    
    if (!userId) {
      setError("User not authenticated");
      navigate("/login");
      return;
    }
    
    try {
      // Get cart items
      const response = await axios.get(`${apiUrl}/cart`, {
        params: { user_id: userId }
      });
      
      if (response.data.success) {
        const cartItems = Array.isArray(response.data.items) ? response.data.items : [];
        
        // Calculate subtotal
        const subtotal = cartItems.reduce((total, item) => total + (item.item_price * item.quantity), 0);
        
        // Get other components from localStorage
        const deliveryFee = 60;
        const selectedCharity = JSON.parse(localStorage.getItem("selectedCharity"));
        const selectedDiscount = JSON.parse(localStorage.getItem("selectedDiscount"));
        
        const charityDonation = selectedCharity ? parseInt(selectedCharity.amount.replace('Rs. ', '')) : 0;
        const discountPercentage = selectedDiscount ? parseInt(selectedDiscount.title) : 0;
        const discountAmount = (subtotal * discountPercentage / 100);
        const total = subtotal + deliveryFee + charityDonation - discountAmount;
        
        // Update state
        setOrderDetails({
          subtotal,
          deliveryFee,
          charityDonation,
          discountAmount,
          total
        });
        
        setFormData(prev => ({ ...prev, amount: total.toFixed(2) }));
      } else {
        setError("Failed to load cart items");
      }
    } catch (error) {
      console.error("Error calculating total:", error);
      setError("Failed to calculate order total");
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
    
//     try {
//       // Simulated payment processing
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // Clear cart after successful payment
//       const userId = localStorage.getItem("user_id");
//       await axios.delete(`${apiUrl}/cart`, {
//         params: { user_id: userId }
//       });
  
//       // Update state and local storage
//       setSuccess(true);
//       localStorage.setItem("transactionId", `ESEWA-${Date.now()}`);
//       localStorage.setItem("paymentAmount", formData.amount);
//       localStorage.setItem("paymentMethod", "eSewa");
  
//       setTimeout(() => {
//         navigate("/order-confirmation");
//       }, 2000);
//     } catch (error) {
//       console.error("Payment processing error:", error);
//       setError("Payment processing failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        const response = await axios.get(`${apiUrl}/loyalty-points`, {
          params: { user_id: userId }
        });
        setLoyaltyPoints(response.data.points || 0);
      } catch (error) {
        console.error("Error fetching loyalty points:", error);
      }
    };
    fetchLoyaltyPoints();
  }, []);
  
  const handleDownloadReceipt = () => {
    const doc = new jsPDF();
    const transactionId = localStorage.getItem("transactionId");
    const date = new Date().toLocaleDateString();
  
    // Add logo
    const logo = "/images/logo.png";
    doc.addImage(logo, "PNG", 10, 10, 30, 30);
  
    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("YOO!!! Food Order Receipt", 50, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Transaction ID: ${transactionId}`, 50, 28);
    doc.text(`Date: ${date}`, 50, 34);
  
    // Order Details
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Order Summary", 10, 50);
  
    let yPos = 60;
    const addLine = (label, value) => {
      doc.setFont("helvetica", "normal");
      doc.text(label, 10, yPos);
      doc.text(`₹${value.toFixed(2)}`, 190, yPos, { align: "right" });
      yPos += 8;
    };
  
    addLine("Subtotal:", orderDetails.subtotal);
    addLine("Delivery Fee:", orderDetails.deliveryFee);
    if (orderDetails.charityDonation > 0) {
      addLine("Charity Donation:", orderDetails.charityDonation);
    }
    if (orderDetails.discountAmount > 0) {
      addLine("Discount:", -orderDetails.discountAmount);
    }
    
    // Total line
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount:", 10, yPos);
    doc.text(`₹${orderDetails.total.toFixed(2)}`, 190, yPos, { align: "right" });
    yPos += 12;
  
    // Loyalty Points Section
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Loyalty Points Earned: ${Math.floor(orderDetails.total / 1000)}`, 10, yPos);
    yPos += 8;
    doc.text(`Remaining Points: ${loyaltyPoints - (selectedDiscount?.requiredPoints || 0)}`, 10, yPos);
  
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Thank you for choosing YOO!!!", 10, 280);
    doc.text("This is an computer-generated receipt", 10, 285);
  
    doc.save("order-receipt.pdf");
  };
  
  // const updateLoyaltyPoints = async () => {
  //   try {
  //     // Declare userId at the beginning of the function
  //     const userId = localStorage.getItem("user_id");
  //     if (!userId || isNaN(userId)) {
  //       throw new Error("Invalid user ID");
  //     }
  
  //     const earnedPoints = Math.floor(orderDetails.total / 1000);
  //     const usedPoints = selectedDiscount?.requiredPoints || 0;
  
  //     // Attempt to update the loyalty points
  //     let response = await axios.put(`${apiUrl}/api/loyalty-points`, {
  //       user_id: parseInt(userId),
  //       earnedPoints: parseInt(earnedPoints),
  //       usedPoints: parseInt(usedPoints),
  //     });
  
  //     setLoyaltyPoints(response.data.newPoints);
  //   } catch (error) {
  //     if (error.response?.status === 404) {
  //       // If user ID does not exist, insert a new row
  //       try {
  //         const userId = localStorage.getItem("user_id"); // Ensure userId is declared here too
  //         const response = await axios.post(`${apiUrl}/api/loyalty-points`, {
  //           user_id: parseInt(userId),
  //           totalPoints: parseInt(orderDetails.total / 1000), // Initialize with earned points
  //         });
  
  //         setLoyaltyPoints(response.data.newPoints);
  //       } catch (insertError) {
  //         console.error("Loyalty Points Insert Error:", insertError.response?.data || insertError.message);
  //         setError(insertError.response?.data?.detail || "Failed to insert loyalty points");
  //       }
  //     } else {
  //       console.error("Loyalty Points Error:", error.response?.data || error.message);
  //       setError(error.response?.data?.detail || "Failed to update loyalty points");
  //     }
  //   }
  // };
  
  // Modify handleSubmit to include loyalty points and receipt
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      
      // Simulated payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart
      const userId = localStorage.getItem("user_id");
      await axios.delete(`${apiUrl}/cart`, { params: { user_id: userId } });
  
      
      // Calculate points earned and used
    const earnedPoints = Math.floor(orderDetails.total / 1000); // Points earned based on the total
    const usedPoints = selectedDiscount?.requiredPoints || 0; // Points used for the discount

    // Update loyalty points (both addition and deduction in one request)
    await axios.post(`${apiUrl}/update-loyalty-points`, {
      user_id: userId,
      total_amount: orderDetails.total,
      used_points: usedPoints,  // Points used from discount
      earned_points: earnedPoints // Points earned from the total
    });

      // Clear local storage
      localStorage.removeItem("deliveryAddress");
      localStorage.removeItem("selectedDiscount");
      localStorage.removeItem("selectedCharity");
  
      // Show success and receipt
      setSuccess(true);
      setReceiptOpen(true);
      
      // Store transaction details
      localStorage.setItem("transactionId", `ESEWA-${Date.now()}`);
      localStorage.setItem("paymentAmount", formData.amount);
      localStorage.setItem("paymentMethod", "eSewa");
  
    } catch (error) {
      console.error("Payment processing error:", error);
      setError("Payment processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      backgroundColor: "#f9f9f9" 
    }}>
      <AppBar position="sticky" sx={{ backgroundColor: "#fff", color: "#333", boxShadow: 2 }}>
        <Toolbar>
          <IconButton 
            edge="start" 
            color="inherit" 
            onClick={() => navigate("/checkout")}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            eSewa Payment
          </Typography>
          <img 
            src="/images/logo.png" 
            alt="YOO!!!" 
            style={{ height: 40, width: 40 }} 
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ my: 4, flex: 1 }}>
        {success ? (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: "center" }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              <AlertTitle>Payment Successful!</AlertTitle>
              Your order has been placed successfully. Redirecting to confirmation page...
            </Alert>
            <CircularProgress sx={{ color: "#52c41a", my: 2 }} />
          </Paper>
        ) : (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Box sx={{ display: "flex", mb: 4, alignItems: "center" }}>
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  eSewa Payment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Complete your payment using eSewa
                </Typography>
              </Box>
              <Box sx={{ ml: "auto" }}>
                <img 
                  src="https://esewa.com.np/common/images/esewa_logo.png" 
                  alt="eSewa Logo" 
                  style={{ height: 50 }} 
                />
              </Box>
            </Box>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Order Summary
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">₹{orderDetails.subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Delivery Fee</Typography>
                  <Typography variant="body2">₹{orderDetails.deliveryFee.toFixed(2)}</Typography>
                </Box>
                {orderDetails.charityDonation > 0 && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Charity Donation</Typography>
                    <Typography variant="body2">₹{orderDetails.charityDonation.toFixed(2)}</Typography>
                  </Box>
                )}
                {orderDetails.discountAmount > 0 && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Discount</Typography>
                    <Typography variant="body2" color="error">-₹{orderDetails.discountAmount.toFixed(2)}</Typography>
                  </Box>
                )}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle2" fontWeight="bold">Total</Typography>
                  <Typography variant="subtitle2" fontWeight="bold" color="#ff9800">₹{orderDetails.total.toFixed(2)}</Typography>
                </Box>
              </Paper>
            </Box>
            
            <form onSubmit={handleSubmit}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Payment Details (Testing Mode)
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                <AlertTitle>Test Credentials</AlertTitle>
                <Typography variant="body2">
                  This is a test environment. Use these credentials:
                </Typography>
                <Typography variant="body2">
                  • Phone: 9800000000
                </Typography>
                <Typography variant="body2">
                  • Transaction PIN: 1234
                </Typography>
              </Alert>
              
              <TextField
                label="eSewa ID (Phone Number)"
                variant="outlined"
                fullWidth
                margin="normal"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                placeholder="98XXXXXXXX"
                inputProps={{ maxLength: 10 }}
              />
              
              <TextField
                label="Transaction PIN"
                variant="outlined"
                fullWidth
                margin="normal"
                name="transactionPin"
                type="password"
                value={formData.transactionPin}
                onChange={handleInputChange}
                required
                inputProps={{ maxLength: 4 }}
              />
              
              <TextField
                label="Amount"
                variant="outlined"
                fullWidth
                margin="normal"
                name="amount"
                value={formData.amount}
                InputProps={{
                  readOnly: true,
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                }}
              />
              
              <Box sx={{ mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    backgroundColor: "#60BB46", // eSewa green
                    height: "48px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: "#4A9E38" },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Pay with eSewa"
                  )}
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  onClick={() => navigate("/checkout")}
                  sx={{
                    mt: 2,
                    borderColor: "#ff9800",
                    color: "#ff9800",
                    height: "48px",
                    "&:hover": {
                      borderColor: "#f57c00",
                      backgroundColor: "rgba(255, 152, 0, 0.1)",
                    },
                  }}
                >
                  Back to Checkout
                </Button>
              </Box>
            </form>
          </Paper>
        )}
      </Container>

      <Dialog open={receiptOpen} onClose={() => setReceiptOpen(false)}>
    <DialogTitle>Payment Successful</DialogTitle>
    <DialogContent>
      <Typography variant="body1" gutterBottom>
        Order Total: ₹{orderDetails.total.toFixed(2)}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Loyalty Points Earned: {Math.floor(orderDetails.total / 1000)}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Remaining Points: {loyaltyPoints - (selectedDiscount?.requiredPoints || 0)}
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleDownloadReceipt} color="primary">
        Download Receipt
      </Button>
      <Button onClick={() => navigate('/order-confirmation')} color="primary">
        Continue
      </Button>
    </DialogActions>
  </Dialog>
      
      {/* Footer */}
      <Box sx={{ 
        textAlign: "center", 
        p: 3, 
        backgroundColor: "#f8f8f8", 
        borderTop: "1px solid #e0e0e0",
        mt: 'auto'
      }}>
        <Typography variant="body2" color="text.secondary">
          © YOO!!! All Rights Reserved
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
          This is a test payment page. No actual transactions will be processed.
        </Typography>
      </Box>
    </div>
  );
};

export default EsewaPayment;
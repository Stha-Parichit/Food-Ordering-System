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
    const transactionId = localStorage.getItem("transactionId") || `ESEWA-${Date.now()}`;
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
    const orderId = formData.productId;
  
    // Set document properties
    doc.setProperties({
      title: 'YOO!!! Order Receipt',
      subject: 'Food Order Receipt',
      author: 'YOO!!! Food Delivery',
      keywords: 'receipt, order, food delivery',
      creator: 'YOO!!! App'
    });
  
    // Colors
    const primaryColor = [255, 152, 0]; // #ff9800 (orange)
    const secondaryColor = [38, 50, 56]; // #263238 (dark blue-grey)
    const lightGrey = [224, 224, 224]; // #e0e0e0
  
    // Background header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');
  
    // Logo (placeholder)
    // In a real implementation, you would use the actual logo
    // doc.addImage(logoDataUrl, 'PNG', 10, 10, 30, 20);
  
    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("YOO!!!", 15, 20);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Food Delivery Receipt", 15, 28);
  
    // Receipt info box
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(120, 10, 75, 25, 2, 2, 'F');
    
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("RECEIPT", 125, 17);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID: ${orderId}`, 125, 23);
    doc.text(`Transaction: ${transactionId}`, 125, 29);
  
    // Date and customer info
    let yPos = 50;
    
    // Date section
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 40, 210, 10, 'F');
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text(`DATE: ${date}`, 15, 47);
    doc.text("PAYMENT METHOD: eSewa", 105, 47);
    
    // Customer info section
    yPos = 60;
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("CUSTOMER INFORMATION", 15, yPos);
    yPos += 7;
    
    const userId = localStorage.getItem("user_id") || "Guest";
    const deliveryAddress = JSON.parse(localStorage.getItem("deliveryAddress") || "{}");
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Customer ID: ${userId}`, 15, yPos);
    yPos += 5;
    
    if (deliveryAddress.address) {
      const addressText = `Delivery Address: ${deliveryAddress.address}`;
      const addressLines = doc.splitTextToSize(addressText, 180);
      doc.text(addressLines, 15, yPos);
      yPos += (addressLines.length * 5) + 2;
    }
    
    if (deliveryAddress.phone) {
      doc.text(`Phone: ${deliveryAddress.phone}`, 15, yPos);
      yPos += 5;
    }
  
    // Order details section
    yPos += 5;
    doc.setFillColor(245, 245, 245);
    doc.rect(0, yPos, 210, 8, 'F');
    
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("ORDER SUMMARY", 15, yPos + 5.5);
    yPos += 13;
    
    // Column headers
    doc.setFontSize(9);
    doc.text("ITEM", 15, yPos);
    doc.text("QTY", 120, yPos);
    doc.text("PRICE", 140, yPos);
    doc.text("TOTAL", 170, yPos);
    yPos += 2;
    
    // Separator line
    doc.setDrawColor(lightGrey[0], lightGrey[1], lightGrey[2]);
    doc.line(15, yPos, 195, yPos);
    yPos += 7;
    
    // Attempt to get cart items from localStorage or use a placeholder if not available
    let cartItems = [];
    try {
      const cartData = localStorage.getItem("cartItems");
      if (cartData) {
        cartItems = JSON.parse(cartData);
      }
    } catch (e) {
      console.error("Failed to parse cart items", e);
    }
    
    // If we don't have actual cart items, create a placeholder
    if (!cartItems || cartItems.length === 0) {
      // Use subtotal to create a reasonable placeholder
      const avgItemPrice = orderDetails.subtotal > 0 ? 
        Math.round(orderDetails.subtotal / 2) : 250;
      
      cartItems = [
        { item_name: "Food Item 1", quantity: 1, item_price: avgItemPrice },
        { item_name: "Food Item 2", quantity: 1, item_price: orderDetails.subtotal - avgItemPrice }
      ];
    }
    
    // Add items
    doc.setFont("helvetica", "normal");
    cartItems.forEach(item => {
      const itemTotal = item.quantity * item.item_price;
      
      // Ensure item name doesn't exceed width
      const itemName = doc.splitTextToSize(item.item_name || "Food Item", 100);
      doc.text(itemName, 15, yPos);
      
      doc.text(item.quantity.toString(), 120, yPos);
      doc.text(`Rs.${item.item_price.toFixed(2)}`, 140, yPos);
      doc.text(`Rs.${itemTotal.toFixed(2)}`, 170, yPos);
      
      yPos += (itemName.length > 1) ? (itemName.length * 5) + 2 : 7;
    });
    
    // Separator line before totals
    yPos += 3;
    doc.setDrawColor(lightGrey[0], lightGrey[1], lightGrey[2]);
    doc.line(15, yPos, 195, yPos);
    yPos += 7;
    
    // Totals section
    const addLine = (label, value, isBold = false) => {
      if (isBold) {
        doc.setFont("helvetica", "bold");
      } else {
        doc.setFont("helvetica", "normal");
      }
      
      doc.text(label, 140, yPos);
      doc.text(`Rs.${value.toFixed(2)}`, 170, yPos);
      yPos += 7;
    };
    
    addLine("Subtotal:", orderDetails.subtotal);
    addLine("Delivery Fee:", orderDetails.deliveryFee);
    
    if (orderDetails.charityDonation > 0) {
      addLine("Charity Donation:", orderDetails.charityDonation);
    }
    
    if (orderDetails.discountAmount > 0) {
      // Use negative amount for discount
      doc.setTextColor(220, 53, 69); // Red color for discount
      addLine("Discount:", -orderDetails.discountAmount);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    }
    
    // Separator line before grand total
    doc.setDrawColor(lightGrey[0], lightGrey[1], lightGrey[2]);
    doc.line(140, yPos - 2, 195, yPos - 2);
    
    // Grand total
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    addLine("TOTAL AMOUNT:", orderDetails.total, true);
    
    // Loyalty points section
    yPos += 10;
    doc.setFillColor(252, 248, 227); // Light yellow
    doc.roundedRect(15, yPos, 180, 25, 2, 2, 'F');
    
    yPos += 8;
    doc.setTextColor(153, 102, 0); // Brown
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("LOYALTY POINTS SUMMARY", 25, yPos);
    yPos += 7;
    
    doc.setFont("helvetica", "normal");
    doc.text(`Points Earned: +${Math.floor(orderDetails.total / 1000)}`, 25, yPos);
    
    if (selectedDiscount?.requiredPoints) {
      doc.text(`Points Used: -${selectedDiscount.requiredPoints}`, 100, yPos);
    }
    
    yPos += 7;
    doc.text(`Current Points Balance: ${loyaltyPoints - (selectedDiscount?.requiredPoints || 0) + Math.floor(orderDetails.total / 1000)}`, 25, yPos);
    
    // Footer
    doc.setDrawColor(lightGrey[0], lightGrey[1], lightGrey[2]);
    doc.line(15, 270, 195, 270);
    
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for choosing YOO!!! Food Delivery", 15, 277);
    doc.text("For any queries, contact our customer support at support@yoo.com", 15, 282);
    
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(7);
    doc.text("This is an electronically generated receipt and does not require a signature", 15, 287);
    
    // QR Code placeholder (in a real implementation, you would generate an actual QR code)
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(160, 270, 20, 20, 1, 1, 'F');
    doc.setFontSize(6);
    doc.setTextColor(100, 100, 100);
    doc.text("Scan to track", 160, 295);
    
    doc.save("YOO-Order-Receipt.pdf");
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
                  <Typography variant="body2">Rs.{orderDetails.subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Delivery Fee</Typography>
                  <Typography variant="body2">Rs.{orderDetails.deliveryFee.toFixed(2)}</Typography>
                </Box>
                {orderDetails.charityDonation > 0 && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Charity Donation</Typography>
                    <Typography variant="body2">Rs.{orderDetails.charityDonation.toFixed(2)}</Typography>
                  </Box>
                )}
                {orderDetails.discountAmount > 0 && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Discount</Typography>
                    <Typography variant="body2" color="error">-Rs.{orderDetails.discountAmount.toFixed(2)}</Typography>
                  </Box>
                )}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle2" fontWeight="bold">Total</Typography>
                  <Typography variant="subtitle2" fontWeight="bold" color="#ff9800">Rs.{orderDetails.total.toFixed(2)}</Typography>
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
                  startAdornment: <Typography sx={{ mr: 1 }}>Rs.</Typography>,
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

      <Dialog 
  open={receiptOpen} 
  onClose={() => setReceiptOpen(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 2,
      p: 1
    }
  }}
>
  <DialogTitle sx={{ 
    textAlign: 'center', 
    pt: 3, 
    fontWeight: 'bold',
    color: '#4CAF50'
  }}>
    Payment Successful! 🎉
  </DialogTitle>
  
  <DialogContent>
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      mb: 2 
    }}>
      {/* Success animation/icon */}
      <Box sx={{ 
        width: 80, 
        height: 80, 
        backgroundColor: '#E8F5E9', 
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mb: 3
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24">
          <path
            fill="#4CAF50"
            d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z"
          />
        </svg>
      </Box>
      
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
        Your order has been placed!
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Thanks for ordering with YOO!!! Your delicious food will be on its way soon.
      </Typography>
      
      {/* Order details card */}
      <Paper 
        elevation={0} 
        variant="outlined" 
        sx={{ 
          p: 2, 
          width: '100%', 
          borderRadius: 2,
          backgroundColor: '#F9F9F9',
          mb: 3
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Order Total:</Typography>
          <Typography variant="body2" fontWeight="medium">Rs.{orderDetails.total.toFixed(2)}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Order ID:</Typography>
          <Typography variant="body2" fontWeight="medium">{formData.productId}</Typography>
        </Box>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ 
            width: 24, 
            height: 24, 
            backgroundColor: '#FFF8E1', 
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mr: 1
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path
                fill="#FFC107"
                d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z"
              />
            </svg>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Loyalty Points Earned:
          </Typography>
          <Typography variant="body2" fontWeight="medium" color="#FFC107" sx={{ ml: 'auto' }}>
            +{Math.floor(orderDetails.total / 1000)} points
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 24, 
            height: 24, 
            backgroundColor: '#F3E5F5', 
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mr: 1
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path
                fill="#9C27B0"
                d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,17V16H9V14H13V13H10A1,1 0 0,1 9,12V9C9,8.45 9.45,8 10,8H11V7H13V8H15V10H11V11H14A1,1 0 0,1 15,12V15C15,15.55 14.55,16 14,16H13V17H11Z"
              />
            </svg>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Total Points Balance:
          </Typography>
          <Typography variant="body2" fontWeight="medium" color="#9C27B0" sx={{ ml: 'auto' }}>
            {loyaltyPoints + Math.floor(orderDetails.total / 1000) - (selectedDiscount?.requiredPoints || 0)} points
          </Typography>
        </Box>
      </Paper>
    </Box>
  </DialogContent>
  
  <DialogActions sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    p: 3, 
    pt: 1 
  }}>
    <Button 
      onClick={handleDownloadReceipt} 
      variant="outlined"
      startIcon={
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"
          />
        </svg>
      }
      fullWidth
      sx={{ 
        mb: 1.5, 
        height: 42, 
        borderColor: '#4CAF50',
        color: '#4CAF50',
        '&:hover': {
          borderColor: '#43A047',
          backgroundColor: 'rgba(76, 175, 80, 0.04)',
        }
      }}
    >
      Download Receipt
    </Button>
    
    <Button 
      onClick={() => navigate('/home')} 
      variant="contained"
      fullWidth
      sx={{ 
        height: 42, 
        backgroundColor: '#4CAF50',
        '&:hover': {
          backgroundColor: '#43A047',
        }
      }}
    >
      Back To Home
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
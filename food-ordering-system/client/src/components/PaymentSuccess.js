import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Paper, Box } from "@mui/material";
import axios from "axios";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from "@mui/icons-material/Download";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Insert order after payment success
    const placeOrderAfterKhalti = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        const apiUrl = "http://localhost:5000";
        // Optionally, get cartItems and total from localStorage or refetch if needed
        const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
        const total = Number(localStorage.getItem("cartTotal") || 0);

        // Get loyalty and charity info from localStorage
        const selectedDiscount = JSON.parse(localStorage.getItem("selectedDiscount") || "null");
        const selectedCharity = JSON.parse(localStorage.getItem("selectedCharity") || "null");

        if (!userId || !cartItems.length || !total) return;

        const orderItems = cartItems.map(item => ({
          food_id: item.food_id,
          quantity: item.quantity,
          price: item.item_price
        }));

        // Place order, pass used_loyalty_points if discount was used
        const orderRes = await axios.post(`${apiUrl}/orders`, {
          user_id: userId,
          items: orderItems,
          total: total,
          used_loyalty_points: selectedDiscount ? selectedDiscount.requiredPoints : 0
        });

        // Insert charity donation if selected
        if (selectedCharity && selectedCharity.amount && Number(selectedCharity.amount) > 0) {
          await axios.post(`${apiUrl}/api/charity-donations`, {
            order_id: orderRes.data.orderId || localStorage.getItem("orderId"),
            user_id: userId,
            charity_name: selectedCharity.title,
            amount: parseInt(selectedCharity.amount)
          });
        }

        // Insert loyalty record if discount was used
        if (selectedDiscount) {
          await axios.post(`${apiUrl}/api/loyalty`, {
            order_id: orderRes.data.orderId || localStorage.getItem("orderId"),
            user_id: userId,
            points_used: selectedDiscount.requiredPoints
          });
        }

        // Optionally clear localStorage for next order
        localStorage.removeItem("selectedDiscount");
        localStorage.removeItem("selectedCharity");
        // localStorage.removeItem("cartItems");
        // localStorage.removeItem("cartTotal");
      } catch (error) {
        // Optionally handle error
      }
    };
    placeOrderAfterKhalti();

    const updateOrderStatusToPlaced = async (orderId) => {
      try {
        const apiUrl = "http://localhost:5000";
        await axios.put(`${apiUrl}/api/orders/${orderId}/status`, {
          status: "Order Placed"
        });
      } catch (error) {
        // Optionally handle error
        console.error("Failed to update order status:", error);
      }
    };

    // Get orderId from localStorage (set this after payment verification in your flow)
    const orderId = localStorage.getItem("orderId");
    if (orderId) {
      updateOrderStatusToPlaced(orderId);
      // Optionally clear orderId from localStorage after updating status
      // localStorage.removeItem("orderId");
    }
  }, []);

  const handleGoHome = () => {
    navigate("/home");
  };

  const handleDownloadReceipt = async () => {
    try {
      const orderId = localStorage.getItem("orderId"); // Retrieve order ID from localStorage
      if (!orderId) {
        alert("Order ID not found. Please try again.");
        return;
      }

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

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 4, 
          borderRadius: 3,
          textAlign: "center",
          background: 'linear-gradient(to bottom, #f8f9fa, #ffffff)'
        }}
      >
        <Box sx={{ mb: 3 }}>
          <img 
            src="https://imgs.search.brave.com/oePehLEjDLe8RJyH4dAgDXaJkYc60_Gpd_-GUavdszw/rs:fit:32:32:1:0/g:ce/aHR0cDovL2Zhdmlj/b25zLnNlYXJjaC5i/cmF2ZS5jb20vaWNv/bnMvZTVjNzJhZDE5/YjY2ZjdlOGEzMmFk/ODViMTY2ZmFiMGVj/MjA3NGE5NWY0Zjdk/MmFkNjUwMWJjNzMw/NzQwM2JkNi9raGFs/dGkuY29tLw" 
            alt="Khalti Logo" 
            style={{ height: '40px' }}
          />
        </Box>
        
        <CheckCircleIcon 
          sx={{ 
            fontSize: 80, 
            color: '#5C2D91', // Khalti purple
            mb: 2 
          }} 
        />

        <Typography variant="h5" sx={{ mb: 2, color: '#5C2D91', fontWeight: 'bold' }}>
          Payment Successful!
        </Typography>

        <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
          Your payment has been processed successfully through Khalti.
          We'll start preparing your order right away!
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleGoHome}
            sx={{
              width: "200px",
              height: "48px",
              backgroundColor: "#5C2D91",
              borderRadius: "24px",
              cursor: "pointer",
              '&:hover': {
                backgroundColor: "#4A2577"
              },
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Back to Home
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleDownloadReceipt}
            startIcon={<DownloadIcon />}
            sx={{
              width: "200px",
              height: "48px",
              borderRadius: "24px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: "bold",
              '&:hover': {
                backgroundColor: "#f5f5f5"
              }
            }}
          >
            Download Receipt
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, color: '#888' }}>
          A confirmation email will be sent to your registered email address.
        </Typography>
      </Paper>
    </Container>
  );
};

export default PaymentSuccess;

import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Container, Box, Paper } from "@mui/material";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const paymentMethod = localStorage.getItem("paymentMethod");

  const handleHomeClick = () => {
    navigate("/home");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, textAlign: "center" }}>
        <Typography variant="h4" sx={{ mb: 4, color: "green" }}>
          Order Confirmed!
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Thank you for your order. Your order has been placed successfully and will be delivered to your address soon.
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Payment Method: {paymentMethod === 'COD' ? 'Cash On Delivery' : 'Paid'}
        </Typography>
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleHomeClick}
            sx={{
              padding: "12px",
              fontSize: "16px",
              textTransform: "none",
              borderRadius: 2,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: "green",
              },
            }}
          >
            Go to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderConfirmation;

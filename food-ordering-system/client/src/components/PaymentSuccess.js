import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Paper, Box } from "@mui/material";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleGoTrack = () => {
    navigate("/track");
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, textAlign: "center" }}>
        <Typography variant="h4" sx={{ mb: 4, color: "#1976d2" }}>
          🎉 Payment Successful!
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Your order has been confirmed. Thank you for your purchase!
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleGoTrack}
            sx={{
              width: "100px",
              height: "40px",
              backgroundColor: "red",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Track Order
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentSuccess;

import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper } from "@mui/material";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          maxWidth: 400,
          textAlign: "center",
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h4" color="error" gutterBottom>
          ❌ Payment Failed
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Something went wrong. Please try again.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/payment")}
          sx={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: 20,
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "#2563eb",
            },
          }}
        >
          Try Again
        </Button>
      </Paper>
    </Box>
  );
};

export default PaymentFailed;

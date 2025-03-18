import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const PaymentStatus = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isSuccess = location.pathname === "/success";

    return (
        <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "#f9f9f9",
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                {isSuccess ? (
                    <CheckCircleIcon sx={{ fontSize: 80, color: "#35A853" }} />
                ) : (
                    <CancelIcon sx={{ fontSize: 80, color: "#d32f2f" }} />
                )}
                <Typography variant="h5" sx={{ mt: 2 }}>
                    {isSuccess ? "Payment Successful" : "Payment Failed"}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    {isSuccess
                        ? "Your transaction has been completed successfully."
                        : "Your transaction could not be processed. Please try again."}
                </Typography>
                <Button
                    variant="contained"
                    sx={{ mt: 3, backgroundColor: "#35A853", "&:hover": { backgroundColor: "#2c8c3f" } }}
                    onClick={() => navigate("/")}
                >
                    Go Back to Home
                </Button>
            </Box>
        </Container>
    );
};

export default PaymentStatus;
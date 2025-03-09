import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Typography, Container, Box, Paper, List, ListItem, ListItemText } from "@mui/material";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>
          Order Details
        </Typography>
        {order ? (
          <List>
            {order.items.map((item) => (
              <ListItem key={item.id}>
                <ListItemText
                  primary={item.food_name}
                  secondary={`Quantity: ${item.quantity} | Price: ₹${item.price}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" align="center">
            Loading order details...
          </Typography>
        )}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button variant="contained" color="primary" onClick={() => navigate("/chef-orders")}>
            Back to Orders
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderDetails;

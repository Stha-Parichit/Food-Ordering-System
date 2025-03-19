import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Typography, Container, Box, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";

const ChefOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (orderId) => {
    navigate(`/order-details/${orderId}`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>
          Chef Orders
        </Typography>
        <List>
          {orders.map((order) => (
            <ListItem key={order.id} button onClick={() => handleOrderClick(order.id)}>
              <ListItemText
                primary={`Order #${order.id}`}
                secondary={`Total: ₹${order.total}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="check" onClick={() => handleOrderClick(order.id)}>
                  <CheckIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default ChefOrders;

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Button } from '@mui/material';
import { io } from 'socket.io-client';
import axios from 'axios';

const ChefPage = () => {
  const [notifications, setNotifications] = useState([]);
  const socket = io('http://localhost:5000', {
    transports: ['websocket', 'polling'], // Ensure compatibility with different transport methods
    path: '/socket.io/', // Explicitly set the Socket.IO path
    reconnection: true, // Enable automatic reconnection
    reconnectionAttempts: 5, // Number of attempts before giving up
    reconnectionDelay: 1000, // Initial delay between attempts (in ms)
  });

  socket.on('connect', () => {
    console.log('Connected to the server:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.warn('Disconnected from the server:', reason);
    if (reason === 'io server disconnect') {
      // The server explicitly disconnected the client
      socket.connect(); // Reconnect manually
    }
  });

  useEffect(() => {
    // Fetch initial notifications
    const fetchNotifications = async () => {
      const response = await axios.get('http://localhost:5000/notifications');
      setNotifications(response.data);
    };
    fetchNotifications();

    // Listen for new orders
    socket.on('new-order', (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.post(`http://localhost:5000/notifications/${id}/read`);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Chef Notifications
      </Typography>
      <Paper elevation={3} sx={{ p: 2 }}>
        <List>
          {notifications.map((notif) => (
            <ListItem key={notif.id} sx={{ mb: 1 }}>
              <ListItemText primary={notif.message} secondary={new Date(notif.created_at).toLocaleString()} />
              <Button variant="contained" color="primary" onClick={() => markAsRead(notif.id)}>
                Mark as Read
              </Button>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ChefPage;

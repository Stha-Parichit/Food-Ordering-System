import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Rating,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/food-items");
        const data = await response.json();
        setFoodItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching food items:", error);
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  const handleAddToCart = () => {
    setOpenDialog(true); // Open dialog when user tries to add to cart
  }

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close dialog without navigation
  }

  const handleLoginRedirect = () => {
    navigate("/login"); // Navigate to login page
    setOpenDialog(false); // Close dialog
  }

  return (
    <div>
      {/* Navbar */}
      <AppBar position="sticky" sx={{ backgroundColor: "#fff", color: "#333" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src="/images/logo.png" alt="Logo" style={{ width: 40, height: 40 }} />
            <Typography variant="h6" sx={{ ml: 2, color: "#333" }}>
              YOO!!!
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mx: "auto" }}>
            <Button sx={{ color: "#333" }} component="a" href="/home">
              Home
            </Button>
            <Button sx={{ color: "#333" }} component="a" href="/dashboard">
              Dashboard
            </Button>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button sx={{ color: "#333", ml: 2 }} component="a" href="/login">
              Login
            </Button>
            <Button sx={{ color: "#333", ml: 2 }} component="a" href="/register">
              Register
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Get Started Section */}
      <Container sx={{ textAlign: "center", mt: 5, py: 5, backgroundColor: "#f8f9fa", borderRadius: 2 }}>
        <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
          Welcome to YOO!!!
        </Typography>
        <Typography variant="h5" color="textSecondary" gutterBottom>
          Your ultimate destination for delicious food, delivered right to your door.
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 600, mx: "auto", mb: 3 }}>
          Explore our wide variety of recipes and dishes, place your order in just a few clicks, and have it delivered to you in no time. Whether you're craving comfort food or something new, we've got you covered.
        </Typography>
        <Button variant="contained" color="primary" size="large" href="/register">
          Start Ordering
        </Button>
      </Container>

      {/* Food Items Section */}
      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" textAlign="center" mb={3}>
          Popular Recipes
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {loading ? (
            <Typography variant="body1" sx={{ textAlign: "center", width: "100%" }}>
              Loading food items...
            </Typography>
          ) : (
            foodItems.slice(0, 6).map((item, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card sx={{ maxWidth: 300, height: "100%", margin: "auto" }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.image_url || "/images/default-placeholder.png"}
                    alt={item.name}
                  />
                  <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {item.description || "No description available."}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                      <Rating
                        name="rating"
                        value={item.rating || 0}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                    </Box>
                    <Button variant="contained" color="primary" fullWidth onClick={handleAddToCart}>
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ textAlign: "center", mt: 5, p: 3, backgroundColor: "#f0f0f0" }}>
        <Typography variant="body2">© YOO!!! All Rights Reserved</Typography>
        <Typography variant="body2">🍴 YOO!!!</Typography>
        <Typography variant="body2">
          Disclaimer: This site is only for ordering and learning to cook food.
        </Typography>
      </Box>

      {/* Dialog for login prompt */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Login Required</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You need to log in to add items to your cart. Please log in to proceed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleLoginRedirect} color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LandingPage;

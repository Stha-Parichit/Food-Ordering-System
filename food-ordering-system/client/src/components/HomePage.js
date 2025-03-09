import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Box, Typography, Grid, TextField, AppBar, Toolbar, Rating, IconButton, Menu, MenuItem, Card, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FaBell, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);  // State for managing popup visibility
  const [popupMessage, setPopupMessage] = useState("");  // State to hold the message for the popup
  const [notifications, setNotifications] = useState([]); // State for notifications
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null); // State for notification dropdown
  const userEmail = localStorage.getItem("userEmail");
  const userId = localStorage.getItem("user_id"); // Get the user ID from localStorage
  console.log("User ID from localStorage:", userId);
  const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "";
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = "User Home";
    const link = document.querySelector("link[rel*='icon']");
    link.href = "./images/logo.png";
  }, []);

  // Add to Cart with Popup message
  const handleAddToCart = async (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setPopupMessage(`${item.name} added to cart!`);
    setOpenPopup(true);  // Open the popup after adding item to cart

    // Store the item in the cart table
    try {
      const token = localStorage.getItem("token");
      console.log("Sending request to add item to cart:", { food_id: item.id, quantity: 1, user_id: userId });
      await axios.post("http://localhost:5000/cart", {
        food_id: item.id,
        quantity: 1,
        user_id: userId // Pass the user ID
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Item successfully added to cart:", { food_id: item.id, quantity: 1, user_id: userId });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      console.error("Error details:", error.response ? error.response.data : "No response data");
    }
  };

  // Fetch Featured Items and Food Items
  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/food-items");
        const data = await response.json();
        setFeaturedItems(data);
      } catch (error) {
        console.error("Error fetching featured items:", error);
      }
    };

    const fetchFoodItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/food-items");
        const data = await response.json();
        setFoodItems(data); 
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
    };

    fetchFeaturedItems();
    fetchFoodItems();
  }, []);

  // Fetch Notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/notifications");
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Carousel Auto-Rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === featuredItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [featuredItems.length]);

  // Carousel Navigation Handlers
  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === featuredItems.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? featuredItems.length - 1 : prev - 1
    );
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredItems = foodItems.filter((item) => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Profile Dropdown Handlers
  const handleClickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  return (
    <div className="home-page">
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
            <Button sx={{ color: "#333" }} component="a" href="/categories">
              Categories
            </Button>
            <Button sx={{ color: "#333" }} component="a" href="/dashboard">
              Dashboard
            </Button>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField variant="outlined" size="small" placeholder="Search" InputProps={{ endAdornment: <SearchIcon /> }} sx={{ bgcolor: "white", borderRadius: 1, mr: 2 }} onChange={handleSearchChange} />
            <IconButton onClick={handleNotificationClick}>
              <FaBell style={{ fontSize: "1.5rem", color: "#333" }} />
            </IconButton>
            <IconButton onClick={handleCartClick}>
              <FaShoppingCart style={{ fontSize: "1.5rem", color: "#333" }} />
            </IconButton>
            <IconButton onClick={handleClickProfile}>
              <AccountCircleIcon sx={{ fontSize: "2rem", color: "#333" }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseProfileMenu}
              sx={{ mt: 2 }}
            >
              <MenuItem>{userEmail}</MenuItem>
              <Link to="/profile" style={{ textDecoration: "none", color: "black" }}>
                <MenuItem>Profile</MenuItem>
              </Link>
              <MenuItem onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("userEmail"); navigate("/login"); }}>
                Logout
              </MenuItem>
            </Menu>
            <Menu
              anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationClose}
              sx={{ mt: 2 }}
            >
              <MenuItem disabled>Notifications</MenuItem>
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <MenuItem key={index}>{notification.message}</MenuItem>
                ))
              ) : (
                <MenuItem>No notifications</MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Carousel Section */}
      <Box sx={{ position: "relative", width: "100%", height: "500px", overflow: "hidden" }}>
        {/* Background Image */}
        {featuredItems.length > 0 && (
          <Box
            sx={{
              backgroundImage: `url(${featuredItems[currentIndex]?.image_url || "/images/default-placeholder.png"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              filter: "brightness(60%)", // Darken the image for better readability
            }}
          />
        )}
        
        {/* Carousel Content */}
        {featuredItems.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              textAlign: "center",
              width: "80%", // You can adjust the width to fit content
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
              {featuredItems[currentIndex]?.name || "Loading..."}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "#f0f0f0" }}>
              {featuredItems[currentIndex]?.description || "Loading description..."}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddToCart(featuredItems[currentIndex])}
              sx={{
                padding: "10px 30px",
                fontSize: "1.2rem",
                fontWeight: "bold",
                backgroundColor: '#ff9800',
                "&:hover": { backgroundColor: '#f57c00'}
              }}
            >
              Order Now
            </Button>
          </Box>
        )}

        {/* Navigation Buttons */}
        <Button
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            color: "white",
            fontSize: "2rem",
            zIndex: 1,
          }}
          onClick={handlePrev}
        >
          ❮
        </Button>

        <Button
          sx={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            color: "white",
            fontSize: "2rem",
            zIndex: 1,
          }}
          onClick={handleNext}
        >
          ❯
        </Button>
      </Box>

      {/* Food Items Section */}
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Best Recipes
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ width: "100%", maxWidth: "400px", boxShadow: 3, borderRadius: 2, position: 'relative', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image_url || "/images/default-placeholder.png"}
                    alt={item.name}
                    sx={{ objectFit: "cover", borderBottom: '2px solid #e0e0e0' }}
                  />
                  <CardContent sx={{ padding: '12px' }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {item.description || "No description available."}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#000', mb: 2 }}>
                      Rs. {item.price}
                    </Typography>
                    
                    {/* Rating Component */}
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                      <Rating
                        name="rating"
                        value={item.rating || 0} // Default to 0 if no rating
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {item.rating || "No rating yet"}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        padding: '12px 0',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        backgroundColor: '#ff9800',
                        "&:hover": { backgroundColor: '#f57c00' }
                      }}
                      onClick={() => handleAddToCart(item)}
                    >
                      Order Now
                    </Button>
                  </CardContent>

                  <Box
                    sx={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      backgroundColor: "#ff9800",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                    }}
                  >
                    New
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" sx={{ mt: 3 }}>
              Loading food items...
            </Typography>
          )}
        </Grid>
      </Box>

      {/* Popup Dialog */}
      <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
        <DialogTitle>Item Added to Cart</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{popupMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPopup(false)} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      {/* Footer Section */}
      <footer className="home-footer" style={{ textAlign: 'center', padding: '40px', marginTop:'40px', backgroundColor: '#f0f0f0' }}>
        <Typography variant="body2" color="textSecondary">© YOO!!! All Rights Reserved</Typography>
        <Typography variant="body2" color="textSecondary">🍴 YOO!!!</Typography>
        <Typography variant="body2" color="textSecondary">
          Disclaimer: This site is only for ordering and learning to cook food.
        </Typography>
      </footer>
    </div>
  );
};

export default HomePage;
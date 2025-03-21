import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Box, Typography, Grid, TextField, AppBar, Toolbar, Rating, IconButton, Menu, MenuItem, Card, CardContent, CardMedia, Snackbar, Container, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FaBell, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CustomizeOrderPopup from "./CustomizeOrderPopup";

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
  const [openCustomizePopup, setOpenCustomizePopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState('');

  useEffect(() => {
    document.title = "User Home";
    const link = document.querySelector("link[rel*='icon']");
    link.href = "./images/logo.png";
  }, []);

  // Add to Cart with customization
const handleAddToCart = (item) => {
  setSelectedItem(item);
  setOpenCustomizePopup(true);
};

// Handle customization save
const handleSaveCustomization = async (item, customization) => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      // Handle case where user is not logged in
      alert("Please log in to add items to your cart");
      navigate("/login");
      return;
    }

    // Show loading indicator
    setLoading(true);

    const response = await axios.post("http://localhost:5000/cart", {
      food_id: item.id,
      user_id: userId,
      quantity: customization.quantity || 1,
      extraCheese: customization.extraCheese || false,
      extraMeat: customization.extraMeat || false,
      extraVeggies: customization.extraVeggies || false,
      noOnions: customization.noOnions || false,
      noGarlic: customization.noGarlic || false,
      spicyLevel: customization.spicyLevel || 'Medium',
      specialInstructions: customization.specialInstructions || ""
    });

    if (response.data.success) {
      // Update local cart for UI (optional, you could also re-fetch cart items)
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItemIndex = cart.findIndex(cartItem => 
        cartItem.id === item.id && 
        cartItem.customization && 
        cartItem.customization.extraCheese === customization.extraCheese &&
        cartItem.customization.extraMeat === customization.extraMeat &&
        cartItem.customization.noOnions === customization.noOnions
      );

      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += customization.quantity;
      } else {
        cart.push({ 
          ...item, 
          quantity: customization.quantity,
          customization: { 
            extraCheese: customization.extraCheese,
            extraMeat: customization.extraMeat,
            extraVeggies: customization.extraVeggies,
            noOnions: customization.noOnions,
            noGarlic: customization.noGarlic,
            spicyLevel: customization.spicyLevel,
            specialInstructions: customization.specialInstructions
          }
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      // Show success message
      let customizationDetails = [];
      if (customization.extraCheese) customizationDetails.push("Extra Cheese");
      if (customization.extraMeat) customizationDetails.push("Extra Meat");
      if (customization.extraVeggies) customizationDetails.push("Extra Veggies");
      if (customization.noOnions) customizationDetails.push("No Onions");
      if (customization.noGarlic) customizationDetails.push("No Garlic");
      if (customization.spicyLevel !== 'Medium') customizationDetails.push(`${customization.spicyLevel} Spice`);

      let messageDetails = customizationDetails.length > 0 
        ? ` with ${customizationDetails.join(", ")}`
        : "";

      setPopupMessage(`${item.name} × ${customization.quantity} added to cart${messageDetails}!`);
      setOpenPopup(true);
    } else {
      console.error("Failed to add item to cart:", response.data.message);
      alert("Failed to add item to cart. Please try again.");
    }
  } catch (error) {
    console.error("Error adding customized order:", error);
    alert("An error occurred. Please try again.");
  } finally {
    setLoading(false);
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

  const handleSearchChange = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      try {
        const response = await axios.get(`http://localhost:5000/search`, {
          params: { query: e.target.value }
        });
        setFoodItems(response.data);
      } catch (error) {
        console.error("Error searching food items:", error);
      }
    } else {
      // Fetch all food items if search query is empty
      const response = await fetch("http://localhost:5000/api/food-items");
      const data = await response.json();
      setFoodItems(data);
    }
  };

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
            <IconButton onClick={handleNotificationClick}>
              <FaBell style={{ fontSize: "1.5rem", color: "#333" }} />
            </IconButton>
            <IconButton onClick={handleCartClick}>
              <FaShoppingCart style={{ fontSize: "1.5rem", color: "#333" }} onClick={handleCartClick}/>
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
            {selectedItem && (
              <CustomizeOrderPopup
                open={openCustomizePopup}
                onClose={() => setOpenCustomizePopup(false)}
                onSave={handleSaveCustomization}
                item={selectedItem}
              />
            )}
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

      {/* Search Component - New Section Between Carousel and Food Items */}
      <Container maxWidth="md" sx={{ mt: -4, mb: 4, position: "relative", zIndex: 2 }}>
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            padding: "15px 25px",
          }}
        >
          <TextField
            fullWidth
            variant="standard"
            placeholder="Search for your favorite food..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#ff9800" }} />
                </InputAdornment>
              ),
              disableUnderline: true,
              sx: { fontSize: "1.1rem" }
            }}
          />
        </Box>
      </Container>

      {/* Food Items Section */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Best Recipes
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {foodItems.length > 0 ? (
            foodItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  width: "100%", 
                  maxWidth: "280px", 
                  boxShadow: 2, 
                  borderRadius: 2, 
                  margin: "auto", 
                  position: 'relative',
                  height: "290px", // Fixed height for uniform size
                  display: "flex",
                  flexDirection: "column"
                }}>
                  <CardMedia
                    component="img"
                    height="120"
                    image={item.image_url || "/images/default-placeholder.png"}
                    alt={item.name}
                    sx={{ objectFit: "cover", borderRadius: "8px 8px 0 0" }}
                  />
                  <CardContent sx={{ padding: '8px', flexGrow: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1, fontSize: "0.9rem" }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.description || "No description available."}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#000', mb: 1 }}>
                      Rs. {item.price}
                    </Typography>

                    {/* Rating Component */}
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
                      <Rating name="rating" value={item.rating || 0} precision={0.5} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1, fontSize: "0.75rem" }}>
                        {item.rating || "No rating"}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        padding: '6px 0',
                        fontWeight: 'bold',
                        fontSize: "0.75rem",
                        textTransform: 'none',
                        backgroundColor: '#ff9800',
                        "&:hover": { backgroundColor: '#f57c00' }
                      }}
                      onClick={() => handleAddToCart(item)}
                    >
                      Order
                    </Button>
                    {selectedItem && (
                      <CustomizeOrderPopup
                        open={openCustomizePopup}
                        onClose={() => setOpenCustomizePopup(false)}
                        onSave={handleSaveCustomization}
                        item={selectedItem}
                      />
                    )}
                  </CardContent>

                  {/* New Label */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "6px",
                      right: "6px",
                      backgroundColor: "#ff9800",
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: "15px",
                      fontSize: "0.7rem",
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

      {/* Snackbar Notification */}
      <Snackbar
        open={openPopup}
        autoHideDuration={3000}
        onClose={() => setOpenPopup(false)}
        message={popupMessage}
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: "#43a047", // Green background for success
            color: "#fff"
          }
        }}
      />

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
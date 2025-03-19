import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CategoryIcon from "@mui/icons-material/Category";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ImageIcon from "@mui/icons-material/Image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const UploadFood = () => {
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [foodCategory, setFoodCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success");
  const [formErrors, setFormErrors] = useState({});

  const [anchorEl, setAnchorEl] = useState(null);
  const userEmail = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  // Predefined categories for selection
  const categories = [
    "Appetizers",
    "Main Course",
    "Desserts",
    "Beverages",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snacks",
    "Vegan",
    "Vegetarian",
    "Gluten-Free",
    "Seafood",
  ];

  useEffect(() => {
    document.title = "Upload New Food Item | YOO!!! Admin";
    const link = document.querySelector("link[rel*='icon']");
    if (link) link.href = "/images/logo.png";
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!foodName.trim()) errors.foodName = "Food name is required";
    if (!description.trim()) errors.description = "Description is required";
    if (!details.trim()) errors.details = "Details are required";
    if (!foodCategory) errors.foodCategory = "Category is required";
    if (!price || price <= 0) errors.price = "Valid price is required";
    if (!image) errors.image = "Food image is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
  
    const formData = new FormData();
    formData.append("foodName", foodName);
    formData.append("description", description);
    formData.append("details", details);
    formData.append("category", foodCategory);
    formData.append("price", price);
    if (image) formData.append("image", image);
  
    try {
      const response = await axios.post("http://localhost:5000/upload-food", formData);
      setMessage(response.data.message);
      setSnackbarType("success");
      setSnackbarOpen(true);
      
      // Clear form after successful submission
      setFoodName("");
      setDescription("");
      setDetails("");
      setFoodCategory("");
      setPrice("");
      setImage(null);
      setImagePreview("");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to upload food item.");
      setSnackbarType("error");
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f7f7f7" }}>
      {/* App Bar */}
      <AppBar position="sticky" elevation={2} sx={{ backgroundColor: "#fff", color: "#333" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src="/images/logo.png" alt="YOO!!!" style={{ width: 40, height: 40 }} />
            <Typography variant="h6" sx={{ ml: 2, color: "#333", fontWeight: 700 }}>
              YOO!!!
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mx: "auto" }}>
            <Button 
              sx={{ color: "#333", mx: 1, '&:hover': { backgroundColor: '#f0f0f0' } }} 
              component="a" 
              href="/home"
            >
              Home
            </Button>
            <Button 
              sx={{ color: "#333", mx: 1, '&:hover': { backgroundColor: '#f0f0f0' } }} 
              component="a" 
              href="/categories"
            >
              Categories
            </Button>
            <Button 
              sx={{ color: "#333", mx: 1, '&:hover': { backgroundColor: '#f0f0f0' } }} 
              component="a" 
              href="/dashboard"
            >
              Dashboard
            </Button>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton sx={{ mr: 1 }}>
              <FaBell style={{ fontSize: "1.2rem", color: "#333" }} />
            </IconButton>
            <IconButton onClick={handleClickProfile}>
              <AccountCircleIcon sx={{ fontSize: "2rem", color: "#333" }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseProfileMenu}
              sx={{ mt: 2 }}
              elevation={3}
            >
              <MenuItem sx={{ minWidth: 180 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {userEmail}
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("userEmail"); navigate("/login"); }}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Paper elevation={0} sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2 }}
          >
            Back to Dashboard
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Upload New Food Item
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Food Name"
                      variant="outlined"
                      fullWidth
                      value={foodName}
                      onChange={(e) => setFoodName(e.target.value)}
                      required
                      error={!!formErrors.foodName}
                      helperText={formErrors.foodName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <RestaurantIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Short Description"
                      variant="outlined"
                      fullWidth
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      error={!!formErrors.description}
                      helperText={formErrors.description}
                      placeholder="Brief description that will appear in food listings"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Detailed Description"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      required
                      error={!!formErrors.details}
                      helperText={formErrors.details}
                      placeholder="Ingredients, preparation method, nutritional information, etc."
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required error={!!formErrors.foodCategory}>
                      <InputLabel id="category-label">Category</InputLabel>
                      <Select
                        labelId="category-label"
                        value={foodCategory}
                        onChange={(e) => setFoodCategory(e.target.value)}
                        label="Category"
                        startAdornment={
                          <InputAdornment position="start">
                            <CategoryIcon color="primary" />
                          </InputAdornment>
                        }
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                      {formErrors.foodCategory && (
                        <FormHelperText>{formErrors.foodCategory}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Price"
                      variant="outlined"
                      fullWidth
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      type="number"
                      inputProps={{ min: "0", step: "0.01" }}
                      error={!!formErrors.price}
                      helperText={formErrors.price}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoneyIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ p: 2, bgcolor: "#f9f9f9" }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                        <ImageIcon sx={{ mr: 1, verticalAlign: "middle" }} color="primary" />
                        Food Image
                      </Typography>
                      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center" }}>
                        <Button
                          variant="contained"
                          component="label"
                          startIcon={<CloudUploadIcon />}
                          sx={{ mb: { xs: 2, sm: 0 }, mr: { xs: 0, sm: 2 } }}
                        >
                          Select Image
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                          />
                        </Button>
                        {formErrors.image && (
                          <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                            {formErrors.image}
                          </Typography>
                        )}
                        {image && (
                          <Typography variant="body2" sx={{ color: "gray" }}>
                            {image.name}
                          </Typography>
                        )}
                      </Box>
                      {imagePreview && (
                        <Box sx={{ mt: 2, textAlign: "center" }}>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "contain" }}
                          />
                        </Box>
                      )}
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                        sx={{ px: 4, py: 1.5 }}
                      >
                        {isSubmitting ? "Uploading..." : "Upload Food Item"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: "#f2f7ff" }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#1976d2" }}>
                Upload Guidelines
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <Typography variant="body2">
                  • Provide a clear and descriptive food name
                </Typography>
                <Typography variant="body2">
                  • Write a short description that accurately represents the food item
                </Typography>
                <Typography variant="body2">
                  • Include detailed information about ingredients and preparation
                </Typography>
                <Typography variant="body2">
                  • Select the most appropriate category for your food item
                </Typography>
                <Typography variant="body2">
                  • Use high-quality images (recommended size: 1200x800px)
                </Typography>
                <Typography variant="body2">
                  • Set a competitive price based on market standards
                </Typography>
              </Stack>
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2" }}>
                  Popular Categories
                </Typography>
                <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {categories.slice(0, 6).map((cat) => (
                    <Chip 
                      key={cat} 
                      label={cat} 
                      size="small" 
                      onClick={() => setFoodCategory(cat)}
                      sx={{ 
                        cursor: "pointer",
                        backgroundColor: foodCategory === cat ? "#1976d2" : "#e0e0e0",
                        color: foodCategory === cat ? "white" : "inherit"
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ backgroundColor: "#f0f0f0", padding: 3, textAlign: "center", borderTop: "1px solid #ddd" }}>
        <Container>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>© YOO!!! All Rights Reserved</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Disclaimer: This site is only for ordering and learning to cook food.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarType} 
          sx={{ width: "100%" }}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UploadFood;
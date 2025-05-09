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
  Zoom,
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
import AdminSidebar from './AdminSidebar';

// Update theme colors to match TutorialUpload
const theme = {
  primary: '#FF9F1C',
  secondary: '#FFBF69',
  background: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)',
  cardBg: '#FFFFFF',
  accent: '#FF8C00',
  success: '#4caf50',
  lightAccent: '#FFD8A9',
  neutral: '#5D5C61',
  darkText: '#333333',
  lightText: '#7D8491',
};

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    "Pizza"
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh', 
      background: theme.background
    }}>
      {/* Add AdminSidebar */}
      <AdminSidebar 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        handleLogout={handleLogout}
      />

      {/* Main content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 3 }, 
          width: { xs: '100%', md: 'calc(100% - 280px)' },
          ml: { xs: 0, md: '0' }
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              mb: 3, 
              display: 'flex', 
              alignItems: 'center', 
              borderRadius: 2,
              background: 'white',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/admin-dashboard')}
              sx={{ 
                mr: 2,
                color: theme.secondary,
                '&:hover': { backgroundColor: theme.lightAccent }
              }}
            >
              Back to Dashboard
            </Button>
            <Typography variant="h5" sx={{ fontWeight: 600, color: theme.darkText, fontFamily: "'Poppins', sans-serif" }}>
              Upload New Food Item
            </Typography>
          </Paper>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  borderRadius: '16px',
                  backgroundColor: theme.cardBg,
                  boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                  border: 'none'
                }}
              >
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
                              <RestaurantIcon sx={{ color: theme.primary }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: theme.primary,
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: theme.primary,
                          },
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
                              <DescriptionIcon sx={{ color: theme.primary }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: theme.primary,
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: theme.primary,
                          },
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
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: theme.primary,
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: theme.primary,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl 
                        fullWidth 
                        required 
                        error={!!formErrors.foodCategory}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: theme.primary,
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: theme.primary,
                          },
                        }}
                      >
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                          labelId="category-label"
                          value={foodCategory}
                          onChange={(e) => setFoodCategory(e.target.value)}
                          label="Category"
                          startAdornment={
                            <InputAdornment position="start">
                              <CategoryIcon sx={{ color: theme.primary }} />
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
                              <AttachMoneyIcon sx={{ color: theme.primary }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: theme.primary,
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: theme.primary,
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'rgba(255, 209, 102, 0.05)',
                          border: `2px dashed ${theme.lightAccent}`,
                          borderRadius: '12px'
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: theme.darkText }}>
                          <ImageIcon sx={{ mr: 1, verticalAlign: "middle", color: theme.primary }} />
                          Food Image
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center" }}>
                          <Button
                            variant="contained"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                            sx={{ 
                              mb: { xs: 2, sm: 0 }, 
                              mr: { xs: 0, sm: 2 },
                              backgroundColor: theme.primary,
                              '&:hover': {
                                backgroundColor: theme.accent,
                              }
                            }}
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
                            <Typography variant="body2" sx={{ color: theme.secondary }}>
                              {image.name}
                            </Typography>
                          )}
                        </Box>
                        {imagePreview && (
                          <Box sx={{ mt: 2, textAlign: "center" }}>
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{ 
                                maxWidth: "100%", 
                                maxHeight: "200px", 
                                objectFit: "contain",
                                borderRadius: "8px" 
                              }}
                            />
                          </Box>
                        )}
                      </Card>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button
                          variant="contained"
                          type="submit"
                          disabled={isSubmitting}
                          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                          sx={{ 
                            px: 4, 
                            py: 1.5,
                            background: 'linear-gradient(45deg, #FF9F1C 30%, #FFBF69 90%)',
                            boxShadow: '0 4px 20px rgba(255, 159, 28, 0.4)',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #FF8C00 30%, #FFA726 90%)',
                              boxShadow: '0 6px 25px rgba(255, 159, 28, 0.5)'
                            },
                            transition: 'all 0.3s ease',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            borderRadius: '12px'
                          }}
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
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: '16px',
                  bgcolor: 'rgba(255, 209, 102, 0.05)',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                  border: `2px dashed ${theme.lightAccent}`
                }}
              >
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600, 
                    color: theme.accent,
                    fontFamily: "'Poppins', sans-serif"
                  }}
                >
                  Upload Guidelines
                </Typography>
                <Divider sx={{ mb: 2, borderColor: theme.primary }} />
                <Stack spacing={2}>
                  <Typography variant="body2" sx={{ color: theme.darkText }}>
                    • Provide a clear and descriptive food name
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.darkText }}>
                    • Write a short description that accurately represents the food item
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.darkText }}>
                    • Include detailed information about ingredients and preparation
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.darkText }}>
                    • Select the most appropriate category for your food item
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.darkText }}>
                    • Use high-quality images (recommended size: 1200x800px)
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.darkText }}>
                    • Set a competitive price based on market standards
                  </Typography>
                </Stack>
                <Box sx={{ mt: 4 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      color: theme.accent,
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
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
                          backgroundColor: foodCategory === cat ? theme.primary : "#fff",
                          color: foodCategory === cat ? "white" : theme.accent,
                          border: `1px solid ${foodCategory === cat ? theme.primary : theme.lightAccent}`,
                          '&:hover': {
                            backgroundColor: foodCategory === cat ? theme.primary : 'rgba(255, 209, 102, 0.1)',
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Feedback Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          TransitionComponent={Zoom}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbarType === "success" ? "success" : "error"} 
            sx={{ 
              width: "100%",
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              backgroundColor: snackbarType === "success" ? theme.success : "#d32f2f"
            }}
            variant="filled"
          >
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default UploadFood;
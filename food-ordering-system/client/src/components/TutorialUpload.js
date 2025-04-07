import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Button,
  FormControl,
  TextField,
  Select,
  MenuItem,
  Stack,
  Typography,
  Snackbar,
  Alert,
  InputLabel,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  useMediaQuery,
  useTheme,
  Paper,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { FaBell, FaShoppingCart } from 'react-icons/fa';
import Sidebar from './Sidebar';

const TutorialUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficultyLevel: '',
    duration: '',
    videoUrl: '',
    ingredients: ['']
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Fetch cart count on component mount
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        const response = await axios.get(`http://localhost:5000/cart?user_id=${userId}`);
        if (response.data.success && response.data.items) {
          setCartCount(response.data.items.reduce((sum, item) => sum + item.quantity, 0));
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { title, description, category, difficultyLevel, duration, videoUrl, ingredients } = formData;
    
    if (!videoUrl || !title || !description || !category || !difficultyLevel || !duration) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }
    
    const filteredIngredients = ingredients.filter(ing => ing.trim() !== '');
    if (filteredIngredients.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please add at least one ingredient',
        severity: 'error'
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      const requestData = {
        videoUrl: videoUrl.trim(),
        title: title.trim(),
        description: description.trim(),
        category,
        difficultyLevel,
        duration: parseInt(duration),
        ingredients: filteredIngredients
      };

      await axios.post('http://localhost:5000/api/tutorials/upload', requestData);
      
      setSnackbar({
        open: true,
        message: 'Tutorial uploaded successfully!',
        severity: 'success'
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        difficultyLevel: '',
        duration: '',
        videoUrl: '',
        ingredients: ['']
      });
    } catch (error) {
      console.error('Upload error:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to upload tutorial',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f7f7f7' }}>
      {/* Sidebar Component */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} handleLogout={handleLogout} />
      
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* App Bar
        <AppBar position="sticky" sx={{ bgcolor: '#fff', color: '#333', boxShadow: 1 }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleSidebar}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src="/images/logo1.png" alt="Logo" style={{ width: 40, height: 35, marginRight: 10 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}>
                YOO!!!
              </Typography>
            </Box>
            
            <Box sx={{ flexGrow: 1 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton color="inherit" sx={{ mr: 1 }}>
                <Badge badgeContent={3} color="error">
                  <FaBell />
                </Badge>
              </IconButton>
              
              <IconButton color="inherit" onClick={() => navigate('/cart')}>
                <Badge badgeContent={cartCount} color="error">
                  <FaShoppingCart />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar> */}
        
        {/* Main Content */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333', mb: 3 }}>
              Upload New Tutorial
            </Typography>
            
            <Divider sx={{ mb: 4 }} />
            
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <FormControl>
                  <TextField
                    required
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter tutorial title"
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>

                <FormControl>
                  <TextField
                    required
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter tutorial description"
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>

                <FormControl required variant="outlined">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    label="Category"
                  >
                    <MenuItem value="appetizers">Appetizers</MenuItem>
                    <MenuItem value="main-course">Main Course</MenuItem>
                    <MenuItem value="desserts">Desserts</MenuItem>
                    <MenuItem value="beverages">Beverages</MenuItem>
                    <MenuItem value="snacks">Snacks</MenuItem>
                  </Select>
                </FormControl>

                <FormControl required variant="outlined">
                  <InputLabel>Difficulty Level</InputLabel>
                  <Select
                    name="difficultyLevel"
                    value={formData.difficultyLevel}
                    onChange={handleInputChange}
                    label="Difficulty Level"
                  >
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>

                <FormControl>
                  <TextField
                    required
                    type="number"
                    label="Duration (minutes)"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="Enter duration in minutes"
                    inputProps={{ min: 1 }}
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>

                <FormControl>
                  <TextField
                    required
                    label="YouTube Video URL"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    placeholder="Enter YouTube video URL"
                    fullWidth
                    variant="outlined"
                  />
                </FormControl>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Ingredients
                  </Typography>
                  {formData.ingredients.map((ingredient, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                        placeholder="Enter ingredient"
                        fullWidth
                        size="small"
                        variant="outlined"
                      />
                      <Button
                        onClick={() => removeIngredient(index)}
                        color="error"
                        variant="outlined"
                        disabled={formData.ingredients.length === 1}
                      >
                        Remove
                      </Button>
                    </Box>
                  ))}
                  <Button 
                    onClick={addIngredient} 
                    variant="outlined" 
                    sx={{ mt: 1, borderRadius: '8px' }}
                    color="primary"
                  >
                    Add Ingredient
                  </Button>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSubmitting}
                  sx={{ 
                    mt: 4, 
                    py: 1.5, 
                    borderRadius: '8px',
                    bgcolor: '#ff9800',
                    '&:hover': { bgcolor: '#f57c00' }
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Upload Tutorial'
                  )}
                </Button>
              </Stack>
            </form>
          </Paper>
          
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </Box>
  );
};

export default TutorialUpload;
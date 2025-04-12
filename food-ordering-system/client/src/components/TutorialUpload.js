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
  IconButton,
  Badge,
  Paper,
  Divider,
  Grid,
  Chip,
  Zoom,
  Fade,
  useTheme
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import CategoryIcon from '@mui/icons-material/Category';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import EggIcon from '@mui/icons-material/Egg';
import DescriptionIcon from '@mui/icons-material/Description';
import TitleIcon from '@mui/icons-material/Title';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { motion } from 'framer-motion'; // For animations (you'll need to install framer-motion)
import Sidebar from './Sidebar';
import ChefSidebar from './ChefSidebar';

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

  // Get difficulty color
  const getDifficultyColor = (level) => {
    switch(level) {
      case 'beginner': return '#4caf50';
      case 'intermediate': return '#ff9800';
      case 'advanced': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'appetizers': return '🍲';
      case 'main-course': return '🍛';
      case 'desserts': return '🍰';
      case 'beverages': return '🍹';
      case 'snacks': return '🍿';
      default: return '🍽️';
    }
  };

  // Animation variants for form elements
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)',
        fontFamily: '"Poppins", sans-serif'
      }}
    >
      <ChefSidebar 
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}
      />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box 
              sx={{ 
                height: '200px', 
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden',
                mb: 4,
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }}
            >
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: 'url(https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.7)',
                  zIndex: 1
                }}
              />
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 2
                }}
              >
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    fontFamily: '"Playfair Display", serif'
                  }}
                >
                  Share Your Culinary Masterpiece
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'white', 
                    mt: 1,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    maxWidth: '600px',
                    textAlign: 'center'
                  }}
                >
                  Inspire our community with your creative recipes and tutorials
                </Typography>
              </Box>
            </Box>
          </motion.div>

          <Paper 
            elevation={0} 
            sx={{ 
              p: 0, 
              borderRadius: '16px', 
              overflow: 'hidden',
              boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
              background: 'white'
            }}
          >
            <Grid container>
              {/* Left side - decorative */}
              <Grid 
                item 
                xs={12} 
                md={3} 
                sx={{ 
                  background: 'linear-gradient(135deg, #FF9F1C 0%, #FFBF69 100%)',
                  display: { xs: 'none', md: 'flex' },
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 4
                }}
              >
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                  <RestaurantIcon sx={{ fontSize: 80, color: 'white', mb: 2 }} />
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                    Create Your Tutorial
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    Share your passion with our foodie community
                  </Typography>
                </Box>

                <Box sx={{ mb: 4, width: '100%' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3, 
                    p: 2, 
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.2)'
                  }}>
                    <Typography sx={{ color: 'white', fontWeight: 'medium' }}>
                      1. Fill in details
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3, 
                    p: 2, 
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.2)'
                  }}>
                    <Typography sx={{ color: 'white', fontWeight: 'medium' }}>
                      2. Add ingredients
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.2)'
                  }}>
                    <Typography sx={{ color: 'white', fontWeight: 'medium' }}>
                      3. Upload & share
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Right side - form */}
              <Grid item xs={12} md={9}>
                <Box sx={{ p: 4 }}>
                  <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: '#333', 
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <CloudUploadIcon sx={{ color: '#FF9F1C' }} />
                    Create New Tutorial
                  </Typography>
                  
                  <Divider sx={{ mb: 4 }} />
                  
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 }}
                      >
                        <FormControl fullWidth>
                          <TextField
                            required
                            label="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter an enticing title for your tutorial"
                            fullWidth
                            variant="outlined"
                            InputProps={{
                              startAdornment: <TitleIcon sx={{ mr: 1, color: '#FF9F1C' }} />,
                              sx: { borderRadius: '10px' }
                            }}
                          />
                        </FormControl>
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.2 }}
                      >
                        <FormControl fullWidth>
                          <TextField
                            required
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your recipe and what makes it special"
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            InputProps={{
                              startAdornment: <DescriptionIcon sx={{ mr: 1, mt: 1, color: '#FF9F1C' }} />,
                              sx: { borderRadius: '10px' }
                            }}
                          />
                        </FormControl>
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.3 }}
                      >
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <FormControl required variant="outlined" fullWidth>
                              <InputLabel>Category</InputLabel>
                              <Select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                label="Category"
                                sx={{ borderRadius: '10px' }}
                                startAdornment={<CategoryIcon sx={{ mr: 1, color: '#FF9F1C' }} />}
                                renderValue={(selected) => (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography>{getCategoryIcon(selected)}</Typography>
                                    <Typography sx={{ textTransform: 'capitalize' }}>
                                      {selected.replace('-', ' ')}
                                    </Typography>
                                  </Box>
                                )}
                              >
                                <MenuItem value="appetizers">🍲 Appetizers</MenuItem>
                                <MenuItem value="main-course">🍛 Main Course</MenuItem>
                                <MenuItem value="desserts">🍰 Desserts</MenuItem>
                                <MenuItem value="beverages">🍹 Beverages</MenuItem>
                                <MenuItem value="snacks">🍿 Snacks</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <FormControl required variant="outlined" fullWidth>
                              <InputLabel>Difficulty Level</InputLabel>
                              <Select
                                name="difficultyLevel"
                                value={formData.difficultyLevel}
                                onChange={handleInputChange}
                                label="Difficulty Level"
                                sx={{ borderRadius: '10px' }}
                                startAdornment={<SchoolIcon sx={{ mr: 1, color: '#FF9F1C' }} />}
                                renderValue={(selected) => (
                                  <Chip 
                                    label={selected.charAt(0).toUpperCase() + selected.slice(1)} 
                                    size="small" 
                                    sx={{ 
                                      backgroundColor: getDifficultyColor(selected),
                                      color: 'white',
                                      fontWeight: 'bold',
                                      borderRadius: '6px'
                                    }} 
                                  />
                                )}
                              >
                                <MenuItem value="beginner">Beginner</MenuItem>
                                <MenuItem value="intermediate">Intermediate</MenuItem>
                                <MenuItem value="advanced">Advanced</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.4 }}
                      >
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                              <TextField
                                required
                                type="number"
                                label="Duration (minutes)"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                placeholder="How long does it take to prepare?"
                                inputProps={{ min: 1 }}
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                  startAdornment: <AccessTimeIcon sx={{ mr: 1, color: '#FF9F1C' }} />,
                                  sx: { borderRadius: '10px' }
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                              <TextField
                                required
                                label="YouTube Video URL"
                                name="videoUrl"
                                value={formData.videoUrl}
                                onChange={handleInputChange}
                                placeholder="Paste your YouTube video link"
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                  startAdornment: <SmartDisplayIcon sx={{ mr: 1, color: '#FF9F1C' }} />,
                                  sx: { borderRadius: '10px' }
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.5 }}
                      >
                        <Box 
                          sx={{ 
                            mt: 2, 
                            p: 3, 
                            border: '2px dashed #FFD8A9', 
                            borderRadius: '12px',
                            background: 'rgba(255, 209, 102, 0.05)'
                          }}
                        >
                          <Typography 
                            variant="h6" 
                            gutterBottom 
                            sx={{ 
                              fontWeight: 'bold', 
                              color: '#FF9F1C',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}
                          >
                            <EggIcon /> Ingredients
                          </Typography>
                          
                          {formData.ingredients.map((ingredient, index) => (
                            <Fade 
                              key={index} 
                              in={true} 
                              style={{ transitionDelay: `${index * 100}ms` }}
                            >
                              <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                                <TextField
                                  value={ingredient}
                                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                                  placeholder="e.g. 2 cups flour"
                                  fullWidth
                                  size="small"
                                  variant="outlined"
                                  sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: '8px',
                                    }
                                  }}
                                />
                                <IconButton
                                  onClick={() => removeIngredient(index)}
                                  color="error"
                                  disabled={formData.ingredients.length === 1}
                                  sx={{ 
                                    borderRadius: '8px',
                                    border: '1px solid',
                                    borderColor: formData.ingredients.length === 1 ? 'transparent' : '#ffcdd2',
                                    p: '8px'
                                  }}
                                >
                                  <RemoveCircleIcon />
                                </IconButton>
                              </Box>
                            </Fade>
                          ))}
                          
                          <Button 
                            onClick={addIngredient} 
                            variant="outlined"
                            startIcon={<AddCircleIcon />}
                            sx={{ 
                              mt: 2, 
                              borderRadius: '8px',
                              borderColor: '#FF9F1C',
                              color: '#FF9F1C',
                              '&:hover': {
                                borderColor: '#FF8C00',
                                backgroundColor: 'rgba(255, 159, 28, 0.1)'
                              }
                            }}
                          >
                            Add Another Ingredient
                          </Button>
                        </Box>
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.6 }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          disabled={isSubmitting}
                          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                          sx={{ 
                            mt: 4, 
                            py: 1.5, 
                            px: 3,
                            borderRadius: '12px',
                            background: 'linear-gradient(45deg, #FF9F1C 30%, #FFBF69 90%)',
                            boxShadow: '0 4px 20px rgba(255, 159, 28, 0.4)',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #FF8C00 30%, #FFA726 90%)',
                              boxShadow: '0 6px 25px rgba(255, 159, 28, 0.5)'
                            },
                            transition: 'all 0.3s ease',
                            fontWeight: 'bold',
                            fontSize: '1rem'
                          }}
                        >
                          {isSubmitting ? 'Uploading...' : 'Publish Your Tutorial'}
                        </Button>
                      </motion.div>
                    </Stack>
                  </form>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            TransitionComponent={Zoom}
          >
            <Alert
              onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
              severity={snackbar.severity}
              variant="filled"
              sx={{ 
                width: '100%',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
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
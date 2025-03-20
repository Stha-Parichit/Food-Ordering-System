import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Box, 
  Typography, 
  Card, 
  CardMedia, 
  CardContent, 
  Chip, 
  Divider, 
  Button, 
  CircularProgress, 
  Container, 
  Grid, 
  Paper, 
  Stack, 
  useTheme, 
  useMediaQuery,
  ThemeProvider,
  createTheme,
  alpha
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Refined food-themed MUI theme with better visual hierarchy
const foodTheme = createTheme({
  palette: {
    primary: {
      main: '#ff6b35', // Orange/red for food appeal
      light: '#ff8c62',
      dark: '#e54b00',
      contrastText: '#fff'
    },
    secondary: {
      main: '#2ec4b6', // Teal accent
      light: '#5ed7cb',
      dark: '#1b877d',
      contrastText: '#fff'
    },
    background: {
      default: '#f9f7f3', // Warm off-white
      paper: '#ffffff'
    },
    text: {
      primary: '#333333',
      secondary: '#666666'
    }
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700
    },
    h5: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 600
    },
    subtitle1: {
      fontWeight: 500
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.875rem'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 16px',
          fontWeight: 600,
          textTransform: 'none'
        }
      }
    }
  }
});

const FoodItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [foodItem, setFoodItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/food-items");
        const data = await response.json();
        
        const item = data.find(item => item.id === parseInt(id));
        
        if (item) {
          if (!item.preparationTime) {
            item.preparationTime = Math.floor(Math.random() * 30) + 15 + ' min';
          }
          
          // Add nutritional info if missing (for demo purposes)
          if (!item.nutritionalInfo) {
            item.nutritionalInfo = {
              calories: Math.floor(Math.random() * 400) + 200,
              protein: Math.floor(Math.random() * 20) + 5 + 'g',
              carbs: Math.floor(Math.random() * 30) + 15 + 'g',
              fat: Math.floor(Math.random() * 15) + 5 + 'g'
            };
          }
          
          // Add dietary tags if missing (for demo purposes)
          if (!item.dietaryTags) {
            const possibleTags = ['Vegetarian', 'Gluten-Free', 'Vegan', 'Dairy-Free', 'Keto-Friendly'];
            const randomTags = [];
            const tagCount = Math.floor(Math.random() * 3);
            
            for (let i = 0; i < tagCount; i++) {
              const randomTag = possibleTags[Math.floor(Math.random() * possibleTags.length)];
              if (!randomTags.includes(randomTag)) {
                randomTags.push(randomTag);
              }
            }
            
            item.dietaryTags = randomTags;
          }
          
          setFoodItem(item);
        } else {
          setError(true);
          toast.error('Food item not found');
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching food item:", error);
        toast.error('Failed to load food item details');
        setError(true);
        setLoading(false);
      }
    };

    fetchFoodItem();
  }, [id]);

  // Function to render spice level icon with appropriate color
  const renderSpiceLevel = (level) => {
    const levels = {
      'Not Spicy': { color: '#9e9e9e', text: 'Not Spicy', icons: 1 },
      'Mild': { color: '#8bc34a', text: 'Mild', icons: 2 },
      'Medium': { color: '#ff9800', text: 'Medium', icons: 3 },
      'Hot': { color: '#f44336', text: 'Hot', icons: 4 },
      'Extra Hot': { color: '#b71c1c', text: 'Extra Hot', icons: 5 }
    };
    
    const spiceLevel = level || 'Medium';
    const { color, text, icons } = levels[spiceLevel];
    
    return (
      <Stack direction="row" spacing={0.5} alignItems="center">
        {[...Array(icons)].map((_, index) => (
          <LocalFireDepartmentIcon 
            key={index}
            fontSize="small" 
            sx={{ color }}
          />
        ))}
        <Typography variant="body2" sx={{ ml: 0.5 }}>{text}</Typography>
      </Stack>
    );
  };

  if (loading) {
    return (
      <ThemeProvider theme={foodTheme}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh',
          bgcolor: foodTheme.palette.background.default
        }}>
          <CircularProgress color="primary" size={60} />
        </Box>
      </ThemeProvider>
    );
  }

  if (error || !foodItem) {
    return (
      <ThemeProvider theme={foodTheme}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh',
          bgcolor: foodTheme.palette.background.default
        }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 4, maxWidth: '90%', width: 450 }}>
            <ErrorOutlineIcon color="primary" sx={{ fontSize: 60 }} />
            <Typography variant="h5" sx={{ mt: 2 }}>
              Food item not found
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              sx={{ mt: 3 }}
              href='/home'
            >
              Back to Home
            </Button>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={foodTheme}>
      <Box sx={{ 
        bgcolor: foodTheme.palette.background.default, 
        minHeight: '100vh',
        py: { xs: 2, sm: 4 }
      }}>
        <Container maxWidth="lg">
          {/* Back button for better navigation */}
          <Button
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/home')}
            sx={{ 
              mb: 2, 
              fontWeight: 500,
              '&:hover': {
                backgroundColor: alpha(foodTheme.palette.primary.main, 0.08)
              }
            }}
          >
            Back to Home
          </Button>

          <Card elevation={0} sx={{ 
            overflow: 'hidden',
            borderRadius: { xs: 2, sm: 4 },
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            mb: 4
          }}>
            <Grid container direction={isMobile ? 'column-reverse' : 'row'}>
              {/* Food details section */}
              <Grid item xs={12} md={6}>
                <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <Typography 
                      variant="h4" 
                      component="h1" 
                      gutterBottom
                      sx={{ 
                        color: foodTheme.palette.text.primary,
                        borderBottom: `3px solid ${foodTheme.palette.primary.main}`,
                        display: 'inline-block',
                        pb: 1,
                        fontSize: { xs: '1.75rem', sm: '2.125rem' }
                      }}
                    >
                      {foodItem.name}
                    </Typography>
                    
                    <Box 
                      sx={{ 
                        bgcolor: foodTheme.palette.primary.main,
                        color: '#fff',
                        borderRadius: '12px',
                        px: 2,
                        py: 0.75,
                        fontWeight: 'bold',
                        fontSize: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        mt: { xs: 0, sm: 0.5 }
                      }}
                    >
                      ${parseFloat(foodItem.price).toFixed(2)}
                    </Box>
                  </Box>
                  
                  <Stack 
                    direction="row" 
                    spacing={1.5} 
                    sx={{ 
                      mb: 3, 
                      mt: 2,
                      flexWrap: 'wrap',
                      gap: 1
                    }}
                  >
                    <Chip 
                      icon={<FoodBankIcon />} 
                      label={foodItem.category} 
                      color="primary" 
                      size="medium"
                    />
                    <Chip 
                      icon={<AccessTimeIcon />} 
                      label={foodItem.preparationTime} 
                      color="secondary" 
                      size="medium"
                    />
                    {foodItem.spiceLevel && (
                      <Chip 
                        icon={<LocalFireDepartmentIcon />}
                        label={foodItem.spiceLevel || 'Medium'} 
                        color="default"
                        size="medium"
                        sx={{ 
                          backgroundColor: foodItem.spiceLevel === 'Hot' || foodItem.spiceLevel === 'Extra Hot' 
                            ? alpha('#f44336', 0.15) 
                            : alpha('#ff9800', 0.15)
                        }}
                      />
                    )}
                  </Stack>
                  
                  {/* Description section */}
                  <Box sx={{ 
                    mt: 3, 
                    p: 2.5, 
                    bgcolor: alpha(foodTheme.palette.primary.light, 0.05), 
                    borderRadius: 2,
                    border: `1px solid ${alpha(foodTheme.palette.primary.main, 0.1)}`
                  }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: foodTheme.palette.primary.dark
                      }}
                    >
                      <MenuBookIcon />
                      Description
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 0 }}>
                      {foodItem.description}
                    </Typography>
                  </Box>
                  
                  {/* Details section (if available) */}
                  {foodItem.details && (
                    <Box sx={{ 
                      mt: 3, 
                      p: 2.5, 
                      bgcolor: alpha(foodTheme.palette.secondary.light, 0.05), 
                      borderRadius: 2,
                      border: `1px solid ${alpha(foodTheme.palette.secondary.main, 0.1)}`
                    }}>
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          color: foodTheme.palette.secondary.dark
                        }}
                      >
                        <LocalDiningIcon />
                        Ingredients & Preparation
                      </Typography>
                      <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 0 }}>
                        {foodItem.details}
                      </Typography>
                    </Box>
                  )}
                  
                  {/* Dietary information */}
                  {foodItem.dietaryTags && foodItem.dietaryTags.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          mb: 1.5, 
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <RestaurantMenuIcon fontSize="small" />
                        Dietary Information
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {foodItem.dietaryTags.map(tag => (
                          <Chip 
                            key={tag}
                            label={tag} 
                            size="small"
                            sx={{ 
                              bgcolor: alpha(foodTheme.palette.success.main, 0.1),
                              color: foodTheme.palette.success.dark,
                              borderColor: alpha(foodTheme.palette.success.main, 0.3),
                              borderWidth: 1,
                              borderStyle: 'solid'
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                  
                  {/* Nutritional information */}
                  {foodItem.nutritionalInfo && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600 }}>
                        Nutritional Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Paper 
                            elevation={0} 
                            sx={{ 
                              p: 1.5, 
                              borderRadius: 2, 
                              textAlign: 'center',
                              bgcolor: alpha(foodTheme.palette.primary.main, 0.05),
                              border: `1px solid ${alpha(foodTheme.palette.primary.main, 0.1)}`
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">Calories</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {foodItem.nutritionalInfo.calories}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Paper 
                            elevation={0} 
                            sx={{ 
                              p: 1.5, 
                              borderRadius: 2, 
                              textAlign: 'center',
                              bgcolor: alpha(foodTheme.palette.primary.main, 0.05),
                              border: `1px solid ${alpha(foodTheme.palette.primary.main, 0.1)}`
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">Protein</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {foodItem.nutritionalInfo.protein}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Paper 
                            elevation={0} 
                            sx={{ 
                              p: 1.5, 
                              borderRadius: 2, 
                              textAlign: 'center',
                              bgcolor: alpha(foodTheme.palette.primary.main, 0.05),
                              border: `1px solid ${alpha(foodTheme.palette.primary.main, 0.1)}`
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">Carbs</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {foodItem.nutritionalInfo.carbs}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Paper 
                            elevation={0} 
                            sx={{ 
                              p: 1.5, 
                              borderRadius: 2, 
                              textAlign: 'center',
                              bgcolor: alpha(foodTheme.palette.primary.main, 0.05),
                              border: `1px solid ${alpha(foodTheme.palette.primary.main, 0.1)}`
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">Fat</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {foodItem.nutritionalInfo.fat}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                  
                  {/* Spice level visualization if not already shown as a chip */}
                  {!foodItem.spiceLevel && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600 }}>
                        Spice Level
                      </Typography>
                      <Paper
                        elevation={0}
                        sx={{ 
                          p: 1.5, 
                          borderRadius: 2,
                          display: 'inline-flex',
                          alignItems: 'center',
                          bgcolor: alpha(foodTheme.palette.warning.main, 0.05),
                          border: `1px solid ${alpha(foodTheme.palette.warning.main, 0.1)}`
                        }}
                      >
                        {renderSpiceLevel(foodItem.spiceLevel)}
                      </Paper>
                    </Box>
                  )}
                </CardContent>
              </Grid>
              
              {/* Food image section */}
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  position: 'relative', 
                  height: { xs: '280px', sm: '350px', md: '100%' },
                  minHeight: { md: '500px' }
                }}>
                  <CardMedia
                    component="img"
                    image={foodItem.image_url || '/images/default-food.jpg'}
                    alt={foodItem.name}
                    sx={{ 
                      height: '100%', 
                      width: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  
                  {/* Gradient overlay for better visibility */}
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 50%)',
                    zIndex: 1
                  }} />
                </Box>
              </Grid>
            </Grid>
          </Card>
          
          {/* Related items section could go here */}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default FoodItemDetails;
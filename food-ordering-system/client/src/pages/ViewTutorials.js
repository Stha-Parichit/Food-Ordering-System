import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Container,
  Box,
  Skeleton,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  Button,
  Rating,
  Badge,
  Divider,
  TextField,
  InputAdornment,
  useMediaQuery,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  useScrollTrigger,
  Slide
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TimerIcon from '@mui/icons-material/Timer';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import BrunchDiningIcon from '@mui/icons-material/BrunchDining';
import EggIcon from '@mui/icons-material/Egg';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getYouTubeVideoId, getYouTubeThumbnail, getYouTubeWatchUrl } from '../utils/youtubeUtils';
import { styled, alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Styled components for consistent UI with Home.js
const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 28,
  padding: '10px 24px',
  fontWeight: 600,
  textTransform: 'none',
  transform: 'translateY(-2px)',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 1)',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.16)',
  },
  position: 'relative',
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 220,
  position: 'relative',
  transition: 'transform 0.5s ease',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '30%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
  },
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  left: 16,
  zIndex: 2,
  fontWeight: 500,
  fontSize: '0.8rem',
  bgcolor: 'rgba(255,255,255,0.8)',
  borderRadius: 2
}));

// Hidden AppBar on scroll
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const ViewTutorials = () => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  const userEmail = localStorage.getItem("userEmail");

  const categories = [
    { name: 'All', icon: <RestaurantIcon /> },
    { name: 'Appetizers', icon: <BrunchDiningIcon /> },
    { name: 'Main Course', icon: <LocalDiningIcon /> },
    { name: 'Desserts', icon: <LunchDiningIcon /> },
    { name: 'Breakfast', icon: <EggIcon /> },
    { name: 'Grilling', icon: <OutdoorGrillIcon /> },
    { name: 'Fast Food', icon: <FastfoodIcon /> },
  ];

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tutorials');
        if (response.data && Array.isArray(response.data)) {
          setTutorials(response.data); // Use data directly from the database
        } else {
          setError('Invalid tutorials data format');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load tutorials');
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/tutorial/${id}`);
  };

  const getDifficultyColor = (level) => {
    const colors = {
      'Beginner': 'success',
      'Intermediate': 'warning',
      'Advanced': 'error'
    };
    return colors[level] || 'default';
  };

  const normalizeCategory = (category) => category.toLowerCase().replace(/\s+/g, '-');

  const filteredTutorials = (tutorials || []).filter(tutorial => {
    const matchesCategory = activeCategory === 'All' || normalizeCategory(tutorial.category) === normalizeCategory(activeCategory);
    const matchesSearch = tutorial.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tutorial.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id"); // Remove logged-in status
    navigate("/"); // Redirect to the landing page
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

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

  return (
    <div>
      {/* Navbar */}
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          sx={{ 
            backgroundColor: "rgba(255, 255, 255, 0.9)", 
            backdropFilter: "blur(10px)",
            color: "#333", 
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <img src="/images/logo1.png" alt="Logo" style={{ width: 50, height: 45 }} />
              </Box>
            </Box>
            
            {!isMobile && (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Button 
                    sx={{ 
                      color: "#333", 
                      fontWeight: 500, 
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'transform 0.2s'
                    }} 
                    component="a" 
                    href="/home"
                  >
                    Home
                  </Button>
                  <Button 
                    sx={{ 
                      color: "#333", 
                      fontWeight: 500, 
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'transform 0.2s'
                    }} 
                    component="a" 
                    href="/view-tutorials"
                  >
                    View Tutorials
                  </Button>
                  <Button 
                    sx={{ 
                      color: "#333", 
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'transform 0.2s'
                    }} 
                    component="a" 
                    href="/dashboard"
                  >
                    Dashboard
                  </Button>
                </Box>
              </>
            )}
            
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {!isMobile && (
                <>
                  <Button 
                    variant="text"
                    startIcon={
                      <Badge badgeContent={cartCount} color="error">
                        <ShoppingCartIcon />
                      </Badge>
                    }
                    sx={{ 
                      mr: 1,
                      color: "#333",
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                    href="/cart"
                  >
                    Cart
                  </Button>
                  <Button 
                    variant="outlined" 
                    sx={{ 
                      mr: 1,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: '#FF6B6B',
                      color: '#FF6B6B',
                      '&:hover': {
                        borderColor: '#FF8E53',
                        backgroundColor: 'rgba(255, 107, 107, 0.04)',
                      },
                    }}
                    component="a" 
                    href="/profile"
                  >
                    My Profile
                  </Button>
                  <StyledButton 
                    variant="contained" 
                    sx={{ 
                      background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                      color: 'white',
                    }}
                    onClick={handleLogout}
                  >
                    Logout
                  </StyledButton>
                </>
              )}
              {isMobile && (
                <IconButton 
                  color="inherit" 
                  onClick={() => navigate("/cart")} 
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      
      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          sx={{
            '& .MuiDrawer-paper': { 
              width: 280,
              borderRadius: '0 16px 16px 0',
            },
          }}
        >
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src="/images/logo1.png" alt="Logo" style={{ width: 50, height: 45 }} />
            </Box>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider />
          
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 1 }}>
              <Avatar sx={{ bgcolor: "#ff9800", mr: 2 }}>
                {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 'medium' }}>
                  {userEmail?.split('@')[0] || 'Guest'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userEmail || 'Not signed in'}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <List>
            <ListItem button component="a" href="/home" onClick={toggleDrawer(false)}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component="a" href="/categories" onClick={toggleDrawer(false)}>
              <ListItemIcon><CategoryIcon /></ListItemIcon>
              <ListItemText primary="Menu" />
            </ListItem>
            <ListItem button component="a" href="/dashboard" onClick={toggleDrawer(false)}>
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component="a" href="/orders" onClick={toggleDrawer(false)}>
              <ListItemIcon><ReceiptIcon /></ListItemIcon>
              <ListItemText primary="My Orders" />
            </ListItem>
          </List>
          
          <Divider />
          
          <List>
            <ListItem button component="a" href="/profile" onClick={toggleDrawer(false)}>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={() => { handleLogout(); toggleDrawer(false)(); }}>
              <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
              <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
            </ListItem>
          </List>
        </Drawer>
      )}
      
      {/* Toolbar spacer */}
      <Toolbar />
      
      <Box sx={{ 
        backgroundColor: 'rgb(250, 250, 252)',
        minHeight: '100vh',
        pb: 8
      }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 6, md: 12 },
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: theme.spacing(0, 0, 4, 4),
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant={isMobile ? "h4" : "h2"} 
                component="h1" 
                fontWeight={800}
                gutterBottom
              >
                Delicious Food Tutorials
              </Typography>
              <Typography 
                variant="h6" 
                component="p"
                sx={{ mb: 4, opacity: 0.9 }}
              >
                Master the art of cooking with our step-by-step video guides
              </Typography>
              <TextField
                fullWidth
                placeholder="Search for recipes, cuisines, or ingredients..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  maxWidth: 500,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 24,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 24,
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ 
                position: 'relative', 
                height: 300,
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Box 
                  component="img"
                  src="/images/food-collage.png" 
                  alt="Food collage"
                  sx={{
                    height: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.2))'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
        
        {/* Decorative elements */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: -100, 
            right: -100, 
            width: 300, 
            height: 300, 
            borderRadius: '50%', 
            backgroundColor: 'rgba(255,255,255,0.1)' 
          }} 
        />
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: -70, 
            left: -70, 
            width: 200, 
            height: 200, 
            borderRadius: '50%', 
            backgroundColor: 'rgba(255,255,255,0.1)' 
          }} 
        />
      </Box>

      <Container maxWidth="lg">
        {/* Category filters */}
        <Box 
          sx={{ 
            mb: 6, 
            display: 'flex', 
            overflowX: 'auto',
            pb: 2,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }}
        >
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={activeCategory === category.name ? "contained" : "outlined"}
              size="large"
              startIcon={category.icon}
              onClick={() => setActiveCategory(category.name)}
              sx={{
                mr: 2,
                borderRadius: 28,
                px: 3,
                py: 1,
                minWidth: 120,
                boxShadow: activeCategory === category.name ? '0 6px 20px rgba(0, 0, 0, 0.15)' : 0,
                whiteSpace: 'nowrap',
                textTransform: 'none',
                fontWeight: 600,
                ...(activeCategory === category.name && {
                  background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                  color: 'white',
                })
              }}
            >
              {category.name}
            </Button>
          ))}
        </Box>

        {/* Tutorial count */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight={600}>
            {activeCategory === 'All' ? 'All Recipes' : activeCategory}
            <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 1 }}>
              ({filteredTutorials.length})
            </Typography>
          </Typography>
        </Box>

        {loading ? (
          <Grid container spacing={4}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Card sx={{ height: '100%', borderRadius: 3, overflow: 'hidden' }}>
                  <Skeleton variant="rectangular" height={220} animation="wave" />
                  <CardContent>
                    <Skeleton variant="text" width="80%" height={30} animation="wave" />
                    <Skeleton variant="text" width="60%" height={20} animation="wave" sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="100%" height={20} animation="wave" />
                    <Skeleton variant="text" width="40%" height={30} animation="wave" sx={{ mt: 2 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            {(filteredTutorials || []).length > 0 ? (
              <Grid container spacing={4}>
                {(filteredTutorials || []).map((tutorial, index) => (
                  <Grid item xs={12} sm={6} md={4} key={tutorial.id}>
                    <StyledCard>
                      {/* Image and quick info overlay */}
                      <Box sx={{ position: 'relative' }}>
                        <StyledCardMedia
                          className="food-image"
                          component="img"
                          image={tutorial.video_url ? getYouTubeThumbnail(getYouTubeVideoId(tutorial.video_url)) : tutorial.thumbnail || '/images/default-food.jpg'}
                          alt={tutorial.title}
                          sx={{
                            objectFit: 'cover'
                          }}
                        />
                        
                        {/* Time overlay */}
                        <CategoryChip
                          icon={<AccessTimeIcon />}
                          label={`${tutorial.duration || 0} minutes`}
                          variant="outlined"
                          style={{color: '#fff', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 4, padding: '4px 8px'}}
                        />
                        
                        {/* Difficulty badge */}
                        <Chip 
                          label={tutorial.difficulty_level} 
                          color={getDifficultyColor(tutorial.difficulty_level)}
                          size="small"
                          sx={{ 
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            fontWeight: 600
                          }}
                        />
                      </Box>
                      
                      {/* Content */}
                      <CardContent 
                        sx={{ 
                          flexGrow: 1, 
                          p: 3, 
                          cursor: 'pointer' 
                        }}
                        onClick={() => handleCardClick(tutorial.id)}
                      >
                        {/* Category */}
                        <Chip
                          icon={<RestaurantIcon />}
                          label={tutorial.category}
                          color="primary"
                          sx={{
                            mb: 1,
                            fontWeight: 500,
                            fontSize: '0.8rem',
                            borderRadius: 2
                          }}
                        />
                        
                        {/* Title */}
                        <Typography 
                          gutterBottom 
                          variant="h6" 
                          component="h2" 
                          sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            lineHeight: 1.3
                          }}
                        >
                          {tutorial.title}
                        </Typography>
                        
                        {/* Rating */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Rating 
                            value={parseFloat(tutorial.rating)} 
                            precision={0.1} 
                            readOnly 
                            size="small"
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            {tutorial.rating}
                          </Typography>
                        </Box>
                        
                        {/* Description */}
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            mb: 2
                          }}
                        >
                          {tutorial.description}
                        </Typography>
                        
                        {/* Categories */}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 'auto' }}>
                          {(tutorial.categories || []).map((category, idx) => (
                            <Chip 
                              key={idx} 
                              label={category} 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                borderRadius: 1,
                                fontWeight: 500,
                                fontSize: '0.7rem'
                              }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                      
                      {/* Footer */}
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          borderTop: '1px solid',
                          borderColor: 'divider',
                          px: 3,
                          py: 1.5
                        }}
                      >
                        <StyledButton
                          variant="contained"
                          onClick={() => handleCardClick(tutorial.id)}
                          sx={{ 
                            background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                            color: 'white',
                          }}
                        >
                          View Recipe
                        </StyledButton>
                        
                        <IconButton color="error" size="small">
                          <FavoriteIcon />
                        </IconButton>
                      </Box>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 10,
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  borderRadius: 4
                }}
              >
                <RestaurantIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                <Typography variant="h5" color="text.secondary" fontWeight={500}>
                  No matching recipes found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your search or category filters
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  sx={{ mt: 3 }}
                  onClick={() => {
                    setActiveCategory('All');
                    setSearchTerm('');
                  }}
                >
                  View all recipes
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
      
      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          bgcolor: '#111', 
          color: 'white',
          py: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 800, 
                    background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mr: 1
                  }}
                >
                  YOO!!!
                </Typography>
                <img src="/images/logo1.png" alt="Logo" style={{ width: 36, height: 36, borderRadius: "10px" }} />
              </Box>
              <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                Delicious food delivered to your doorstep. We make food ordering and delivery simple, reliable, and fun.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {[{ icon: <FacebookIcon />, name: 'facebook' },
                  { icon: <TwitterIcon />, name: 'twitter' },
                  { icon: <InstagramIcon />, name: 'instagram' },
                  { icon: <YouTubeIcon />, name: 'youtube' }].map((social) => (
                  <IconButton 
                    key={social.name} 
                    size="small" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&:hover': {
                        color: 'white',
                        transform: 'translateY(-3px)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Company
              </Typography>
              <List dense disablePadding>
                {['About Us', 'Careers', 'Blog', 'Press'].map(item => (
                  <ListItem key={item} sx={{ px: 0 }}>
                    <Button 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)', 
                        textTransform: 'none',
                        p: 0,
                        justifyContent: 'flex-start',
                        '&:hover': {
                          color: 'white',
                          backgroundColor: 'transparent'
                        }
                      }}
                    >
                      {item}
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Help
              </Typography>
              <List dense disablePadding>
                {['FAQ', 'Support', 'Contact Us', 'Privacy Policy'].map(item => (
                  <ListItem key={item} sx={{ px: 0 }}>
                    <Button 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)', 
                        textTransform: 'none',
                        p: 0,
                        justifyContent: 'flex-start',
                        '&:hover': {
                          color: 'white',
                          backgroundColor: 'transparent'
                        }
                      }}
                    >
                      {item}
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Subscribe to our newsletter
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                Get the latest news and special offers
              </Typography>
              <Box 
                component="form" 
                sx={{ 
                  display: 'flex',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  style={{
                    flex: 1,
                    border: 'none',
                    padding: '12px 16px',
                    backgroundColor: 'transparent',
                    color: 'white',
                    outline: 'none'
                  }}
                />
                <Button 
                  variant="contained" 
                  sx={{ 
                    borderRadius: 0,
                    background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                    px: 2
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
              © {new Date().getFullYear()} YOO!!! Food Delivery. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.5)', 
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  '&:hover': {
                    color: 'white',
                    backgroundColor: 'transparent'
                  }
                }}
              >
                Terms of Service
              </Button>
              <Button 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.5)', 
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  '&:hover': {
                    color: 'white',
                    backgroundColor: 'transparent'
                  }
                }}
              >
                Privacy Policy
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </div>
  );
};

export default ViewTutorials;
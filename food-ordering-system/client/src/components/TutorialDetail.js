import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Skeleton,
  Rating,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  Drawer,
  Badge,
  useScrollTrigger,
  Slide
} from '@mui/material';
import {
  AccessTime,
  Category,
  FiberManualRecord,
  Bookmark,
  BookmarkBorder,
  Share,
  ArrowBack,
  PlayArrow,
  MenuBook,
  EmojiEvents,
  Person,
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { styled, alpha } from '@mui/material/styles';
import axios from 'axios';
import { getYouTubeVideoId } from '../utils/youtubeUtils';
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

const TutorialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [tutorial, setTutorial] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    fetchTutorialDetails();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);
  
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

  const fetchTutorialDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/tutorials/${id}`);
      setTutorial(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tutorial details:', error);
      setError('Failed to load tutorial details');
      setLoading(false);
    }
  };

  const getDifficultyColor = (level) => {
    const colors = {
      'Beginner': 'success',
      'Intermediate': 'warning',
      'Advanced': 'error'
    };
    return colors[level] || 'default';
  };

  const getEmbedUrl = (videoUrl) => {
    const videoId = getYouTubeVideoId(videoUrl);
    return videoId ? `https://www.youtube.com/embed/${videoId}${playingVideo ? '?autoplay=1' : ''}` : '';
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // Add logic to save bookmark to user profile
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tutorial.title,
        text: 'Check out this tutorial!',
        url: window.location.href,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Sharing is not supported on this browser.');
    }
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper 
            elevation={3}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexDirection: 'column', 
              py: 8,
              px: 4,
              borderRadius: 3,
              textAlign: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Typography color="error" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              {error}
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<ArrowBack />} 
              onClick={() => navigate(-1)}
              sx={{ 
                mt: 3, 
                borderRadius: 2,
                px: 3,
                py: 1,
                boxShadow: theme.shadows[4]
              }}
            >
              Go Back
            </Button>
          </Paper>
        </motion.div>
      </Container>
    );
  }

  const SkeletonLoader = () => (
    <Box>
      <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2, borderRadius: 2 }} />
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Skeleton variant="rounded" width={100} height={32} sx={{ borderRadius: 16 }} />
        <Skeleton variant="rounded" width={100} height={32} sx={{ borderRadius: 16 }} />
        <Skeleton variant="rounded" width={100} height={32} sx={{ borderRadius: 16 }} />
      </Box>
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        sx={{ 
          aspectRatio: '16/9', 
          mb: 4, 
          borderRadius: 3,
          animation: "pulse 1.5s ease-in-out 0.5s infinite"
        }} 
      />
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Skeleton variant="text" sx={{ fontSize: '2.5rem', borderRadius: 1 }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem', borderRadius: 1 }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem', borderRadius: 1 }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem', width: '80%', borderRadius: 1 }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
        </Grid>
      </Grid>
    </Box>
  );

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
              <ListItemIcon><Category /></ListItemIcon>
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
              <ListItemIcon><Person /></ListItemIcon>
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
      
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: { xs: 3, md: 6 },
          px: { xs: 2, md: 3 }
        }}
      >
      {loading ? (
        <SkeletonLoader />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />} 
            onClick={() => navigate(-1)}
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              px: 2
            }}
          >
            Back to Tutorials
          </Button>
          
          <Card 
            elevation={4} 
            sx={{ 
              overflow: 'hidden',
              borderRadius: 3,
              mb: 5,
              background: 'linear-gradient(to bottom, rgba(249,250,251,1) 0%, rgba(240,242,245,1) 100%)',
              position: 'relative'
            }}
          >
            <Box sx={{ 
              position: 'relative',
              width: '100%', 
              aspectRatio: '16/9',
              bgcolor: 'black',
              overflow: 'hidden',
              cursor: playingVideo ? 'auto' : 'pointer',
              '&:hover .play-overlay': {
                opacity: 1
              }
            }}
            onClick={() => !playingVideo && setPlayingVideo(true)}
            >
              {playingVideo ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={getEmbedUrl(tutorial.video_url)}
                  title={tutorial.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <Box 
                    component="img"
                    src={`https://img.youtube.com/vi/${getYouTubeVideoId(tutorial.video_url)}/maxresdefault.jpg`}
                    alt={tutorial.title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.85)',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  <Box 
                    className="play-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0.9,
                      transition: 'opacity 0.3s ease'
                    }}
                  >
                    <IconButton 
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.9)',
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.main',
                          color: 'white'
                        },
                        width: { xs: 60, md: 80 },
                        height: { xs: 60, md: 80 },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <PlayArrow sx={{ fontSize: { xs: 40, md: 50 } }} />
                    </IconButton>
                  </Box>
                </>
              )}
            </Box>
            
            <CardContent sx={{ pt: 4, pb: 5, px: { xs: 2, md: 4 } }}>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: { xs: 'flex-start', md: 'center' }, 
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: { xs: 2, md: 0 },
                  mb: 3 
                }}>
                  <Typography 
                    variant="h4" 
                    component="h1" 
                    sx={{ 
                      fontWeight: 700, 
                      fontSize: { xs: '1.75rem', md: '2.25rem' },
                      background: 'linear-gradient(45deg, #333333 30%, #666666 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.2
                    }}
                  >
                    {tutorial.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={bookmarked ? 'Remove from saved' : 'Save tutorial'}>
                      <Button 
                        variant="contained" 
                        color={bookmarked ? 'primary' : 'secondary'}
                        startIcon={bookmarked ? <Bookmark /> : <BookmarkBorder />}
                        onClick={handleBookmark}
                        sx={{ 
                          borderRadius: 2,
                          textTransform: 'none',
                          boxShadow: 2,
                          fontWeight: 500,
                          px: 2
                        }}
                      >
                        {bookmarked ? 'Saved' : 'Save'}
                      </Button>
                    </Tooltip>
                    <Tooltip title="Share this tutorial">
                      <Button 
                        variant="outlined"
                        startIcon={<Share />}
                        onClick={handleShare}
                        sx={{ 
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500,
                          px: 2
                        }}
                      >
                        Share
                      </Button>
                    </Tooltip>
                  </Box>
                </Box>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1.5, 
                  mb: 4, 
                  flexWrap: 'wrap',
                  mt: { xs: 1, md: 0 }
                }}>
                  <Chip
                    icon={<Category fontSize="small" />}
                    label={tutorial.category}
                    color="primary"
                    sx={{ 
                      px: 1, 
                      borderRadius: 2,
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      py: 0.5
                    }}
                  />
                  <Chip
                    icon={<EmojiEvents fontSize="small" />}
                    label={tutorial.difficulty_level}
                    color={getDifficultyColor(tutorial.difficulty_level)}
                    sx={{ 
                      px: 1,
                      borderRadius: 2,
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      py: 0.5
                    }}
                  />
                  <Chip
                    icon={<AccessTime fontSize="small" />}
                    label={`${tutorial.duration} minutes`}
                    variant="outlined"
                    sx={{ 
                      px: 1,
                      borderRadius: 2,
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      py: 0.5
                    }}
                  />
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 4, 
                  p: 2,
                  borderRadius: 3,
                  bgcolor: 'rgba(0,0,0,0.03)'
                }}>
                  <Avatar 
                    sx={{ 
                      width: 56, 
                      height: 56,
                      mr: 2, 
                      bgcolor: 'primary.main',
                      boxShadow: 2
                    }}
                  >
                    {tutorial.instructor ? tutorial.instructor.charAt(0).toUpperCase() : 'T'}
                  </Avatar>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person fontSize="small" color="action" />
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '1.1rem'
                        }}
                      >
                        {tutorial.instructor || 'Tutorial Instructor'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Rating 
                        value={tutorial.rating || 4.5} 
                        precision={0.5} 
                        readOnly 
                        size="small" 
                      />
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ ml: 1, fontWeight: 500 }}
                      >
                        {tutorial.rating || 4.5}/5
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <MenuBook color="primary" />
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700, 
                            borderBottom: '3px solid', 
                            borderColor: 'primary.main',
                            display: 'inline-block',
                            pb: 0.5
                          }}
                        >
                          Description
                        </Typography>
                      </Box>
                      <Paper
                        elevation={0}
                        sx={{ 
                          p: 3, 
                          borderRadius: 3,
                          bgcolor: 'rgba(255,255,255,0.7)',
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            lineHeight: 1.8,
                            color: 'text.primary',
                            fontSize: '1.05rem'
                          }}
                        >
                          {tutorial.description}
                        </Typography>
                      </Paper>
                    </Box>
                  </motion.div>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 3,
                        bgcolor: 'rgba(255,255,255,0.7)',
                        border: '1px solid',
                        borderColor: theme.palette.primary.light,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        overflow: 'hidden'
                      }}
                    >
                      <Box sx={{ 
                        bgcolor: 'primary.main', 
                        py: 1.5,
                        px: 3,
                        color: 'white'
                      }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          <FiberManualRecord fontSize="small" /> 
                          Ingredients
                        </Typography>
                      </Box>
                      <CardContent sx={{ px: 2 }}>
                        <List sx={{ py: 1 }}>
                          {tutorial.ingredients.map((ingredient, index) => (
                            <React.Fragment key={index}>
                              <ListItem 
                                sx={{ 
                                  py: 1.5,
                                  px: 1,
                                  borderRadius: 2,
                                  '&:hover': {
                                    bgcolor: 'rgba(0,0,0,0.03)'
                                  },
                                  transition: 'background-color 0.2s'
                                }}
                              >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                  <FiberManualRecord fontSize="small" color="primary" />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={ingredient} 
                                  primaryTypographyProps={{ 
                                    fontWeight: 500,
                                    fontSize: '1rem'
                                  }}
                                />
                              </ListItem>
                              {index < tutorial.ingredients.length - 1 && (
                                <Divider sx={{ opacity: 0.6 }} />
                              )}
                            </React.Fragment>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Container>
      
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

export default TutorialDetail;
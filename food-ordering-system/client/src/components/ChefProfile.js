import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUser, FaHeart, FaCog } from "react-icons/fa";
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  IconButton, 
  Avatar, 
  Divider, 
  Grid, 
  Paper, 
  Tab, 
  Tabs, 
  Badge,
  Switch,
  FormControlLabel,
  Container,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
  CircularProgress
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ChefSidebar from "./ChefSidebar"; // Import the Sidebar component
import axios from 'axios';

const ChefProfile = () => {
  const [value, setValue] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    bio: ''
  });
  const [message, setMessage] = useState({ text: '', type: 'success', open: false });

  const userEmail = localStorage.getItem("userEmail") || "user1@example.com";
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    document.title = "User profile - YOO!!!";
    const link = document.querySelector("link[rel*='icon']");
    if (link) link.href = "./images/logo.png";

    const fetchUserData = async () => {
      const storedUserId = localStorage.getItem("user_id");
      console.log("Stored userId:", storedUserId); // Debug log

      if (!storedUserId) {
        console.log("No userId found in localStorage"); // Debug log
        navigate('/login');
        return;
      }

      try {
        console.log("Attempting to fetch user data for ID:", storedUserId); // Debug log
        const response = await axios.get(`http://localhost:5000/api/users/${storedUserId}`);
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch user data');
        }

        const data = response.data.data;
        console.log("Received user data:", data); // Debug log
        
        setUserData(data);
        setFormData({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          bio: data.bio || 'I love cooking and exploring new recipes.'
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        const errorMessage = error.response?.data?.message || 'Failed to load user data';
        setMessage({
          text: errorMessage,
          type: 'error',
          open: true
        });
        
        if (error.response?.status === 404) {
          localStorage.removeItem("userId"); // Clear invalid userId
          localStorage.removeItem("token");
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${userId}`, formData);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      setUserData(response.data.data);
      setMessage({
        text: 'Profile updated successfully!',
        type: 'success',
        open: true
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        text: error.response?.data?.message || 'Failed to update profile',
        type: 'error',
        open: true
      });
    }
  };

  const handleCloseMessage = () => {
    setMessage(prev => ({ ...prev, open: false }));
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* Using the Sidebar component */}
      <ChefSidebar 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        handleLogout={handleLogout} 
      />

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          width: { xs: '100%', md: `calc(100% - 280px)` }, 
          ml: { xs: 0, md: '0' },
          transition: 'margin 0.2s ease-in-out',
        }}
      >
        <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
          {/* Mobile Header */}
          <Box sx={{ 
            display: { xs: 'flex', md: 'none' }, 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 2,
            backgroundColor: '#fff',
            padding: 2,
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <IconButton onClick={toggleSidebar}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: '600' }}>
              My Profile
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton sx={{ mr: 1 }}>
                <Badge badgeContent={3} color="error">
                  <FaBell />
                </Badge>
              </IconButton>
              <IconButton onClick={toggleUserMenu}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#FF6384' }}>
                  {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </IconButton>
            </Box>
          </Box>

          {/* Page Title - Desktop */}
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold', 
            marginBottom: 3, 
            display: { xs: 'none', md: 'block' }, 
            color: '#1a1a2e' 
          }}>
            My Profile
          </Typography>

          {/* Profile Header Card */}
          <Paper sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            mb: 3,
            overflow: 'hidden',
          }}>
            {/* Profile Cover */}
            <Box sx={{ 
              height: 150, 
              bgcolor: 'linear-gradient(90deg, #FF9800 0%, #FF9F80 100%)',
              background: 'linear-gradient(90deg, #FF9800 0%, #FF9F80 100%)',
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-start',
              p: 2
            }}>
              <Box sx={{ 
                position: 'absolute',
                bottom: -40,
                left: { xs: '50%', sm: 32 },
                transform: { xs: 'translateX(-50%)', sm: 'none' }
              }}>
                <Avatar 
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    bgcolor: '#FF9800',
                    fontSize: '2.5rem',
                    border: '4px solid #fff',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <IconButton 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    right: 0, 
                    backgroundColor: '#FF9800',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#e55c7b' },
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)', 
                    width: 30,
                    height: 30 
                  }}
                >
                  <EditIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
              </Box>
            </Box>
            
            {/* Profile Info */}
            <Box sx={{ 
              p: 3, 
              mt: { xs: 5, sm: 0 },
              ml: { xs: 0, sm: 12 },
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' },
              justifyContent: 'space-between'
            }}>
              <Box sx={{
                textAlign: { xs: 'center', sm: 'left' },
                mt: { xs: 0, sm: 2 }
              }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {formData.fullName || 'Loading...'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {formData.email || userEmail}
                </Typography>
                <Typography variant="body2" sx={{ maxWidth: 500 }}>
                  {formData.bio || 'I love cooking and exploring new recipes. Always looking for new food inspiration and ideas!'}
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                mt: { xs: 2, sm: 0 },
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', sm: 'flex-start' } 
              }}>
                <Button 
                  variant="contained" 
                  startIcon={<EditIcon />}
                  sx={{ 
                    backgroundColor: '#FF9800',
                    '&:hover': { backgroundColor: '#e55c7b' },
                    borderRadius: 8,
                    textTransform: 'none',
                    boxShadow: '0 4px 8px rgba(255,99,132,0.25)',
                    color: '#fff',
                  }}
                >
                  Edit Profile
                </Button>
                <Button 
                  variant="outlined" 
                  sx={{ 
                    borderColor: '#FF9800',
                    color: '#FF9800',
                    '&:hover': { 
                      backgroundColor: 'rgba(255,99,132,0.05)',
                      borderColor: '#FF9800'
                    },
                    borderRadius: 8,
                    textTransform: 'none'
                  }}
                >
                  Activity Log
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Tabs and Content */}
          <Paper sx={{ 
            borderRadius: 3, 
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            overflow: 'hidden'
          }}>
            <Tabs 
              value={value} 
              onChange={handleTabChange} 
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                backgroundColor: 'white',
                '& .MuiTab-root': { 
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  px: 3,
                  py: 2
                },
                '& .Mui-selected': { color: '#FF9800' },
                '& .MuiTabs-indicator': { backgroundColor: '#FF9800', height: 3 }
              }}
            >
              <Tab label="Personal Info" />
              <Tab label="Preferences" />
            </Tabs>
            
            <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: 'white' }}>
              {value === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Full Name"
                      name="fullName"
                      fullWidth
                      value={formData.fullName}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      label="Email"
                      name="email"
                      fullWidth
                      value={formData.email}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      label="Phone Number"
                      name="phone"
                      fullWidth
                      value={formData.phone}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={{ mb: 3 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Bio"
                      name="bio"
                      fullWidth
                      multiline
                      rows={4}
                      value={formData.bio}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      label="Address"
                      name="address"
                      fullWidth
                      value={formData.address}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={{ mb: 3 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button 
                        variant="contained" 
                        onClick={handleSaveChanges}
                        sx={{ 
                          backgroundColor: '#FF9800',
                          '&:hover': { backgroundColor: '#e55c7b' },
                          borderRadius: 8,
                          textTransform: 'none',
                          px: 4, 
                          py: 1.2,
                          boxShadow: '0 4px 8px rgba(255,99,132,0.25)'
                        }}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Add Snackbar for messages */}
      <Snackbar
        open={message.open}
        autoHideDuration={6000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseMessage} severity={message.type} sx={{ width: '100%' }}>
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChefProfile;
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
  useMediaQuery
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import Sidebar from "./Sidebar"; // Import the Sidebar component

const ProfilePage = () => {
  const [value, setValue] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userEmail = localStorage.getItem("userEmail") || "user1@example.com";
  const firstName = "Parichit";
  const lastName = "Shrestha";
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    document.title = "User profile - YOO!!!";
    const link = document.querySelector("link[rel*='icon']");
    if (link) link.href = "./images/logo.png";
  }, []);

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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* Using the Sidebar component */}
      <Sidebar 
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
                  {firstName ? firstName.charAt(0).toUpperCase() : 'U'}
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
              bgcolor: 'linear-gradient(90deg, #FF6384 0%, #FF9F80 100%)',
              background: 'linear-gradient(90deg, #FF6384 0%, #FF9F80 100%)',
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
                    bgcolor: '#FF6384',
                    fontSize: '2.5rem',
                    border: '4px solid #fff',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  {firstName ? firstName.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <IconButton 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    right: 0, 
                    backgroundColor: '#FF6384',
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
                  {firstName} {lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {userEmail}
                </Typography>
                <Typography variant="body2" sx={{ maxWidth: 500 }}>
                  I love cooking and exploring new recipes. Always looking for new food inspiration and ideas!
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
                    backgroundColor: '#FF6384',
                    '&:hover': { backgroundColor: '#e55c7b' },
                    borderRadius: 8,
                    textTransform: 'none',
                    boxShadow: '0 4px 8px rgba(255,99,132,0.25)'
                  }}
                >
                  Edit Profile
                </Button>
                <Button 
                  variant="outlined" 
                  sx={{ 
                    borderColor: '#FF6384',
                    color: '#FF6384',
                    '&:hover': { 
                      backgroundColor: 'rgba(255,99,132,0.05)',
                      borderColor: '#FF6384'
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

          {/* Profile Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ 
                p: 2, 
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                height: '100%'
              }}>
                <Avatar sx={{ bgcolor: 'rgba(255,99,132,0.1)', color: '#FF6384', mr: 2 }}>
                  <FaHeart />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Favorites</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>24</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ 
                p: 2, 
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                height: '100%'
              }}>
                <Avatar sx={{ bgcolor: 'rgba(54,162,235,0.1)', color: '#36A2EB', mr: 2 }}>
                  <FaUser />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Following</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>128</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ 
                p: 2, 
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                height: '100%'
              }}>
                <Avatar sx={{ bgcolor: 'rgba(75,192,192,0.1)', color: '#4BC0C0', mr: 2 }}>
                  <FaUser />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Followers</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>356</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ 
                p: 2, 
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                height: '100%'
              }}>
                <Avatar sx={{ bgcolor: 'rgba(255,205,86,0.1)', color: '#FFCD56', mr: 2 }}>
                  <FaCog />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">New Notifications</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>8</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

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
                '& .Mui-selected': { color: '#FF6384' },
                '& .MuiTabs-indicator': { backgroundColor: '#FF6384', height: 3 }
              }}
            >
              <Tab label="Personal Info" />
              <Tab label="Preferences" />
              <Tab label="Security" />
            </Tabs>
            
            <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: 'white' }}>
              {value === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="First Name"
                      fullWidth
                      defaultValue={firstName}
                      variant="outlined"
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      label="Last Name"
                      fullWidth
                      defaultValue={lastName}
                      variant="outlined"
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      label="Email"
                      fullWidth
                      defaultValue={userEmail}
                      variant="outlined"
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      label="Phone Number"
                      fullWidth
                      defaultValue="+1 (555) 123-4567"
                      variant="outlined"
                      sx={{ mb: 3 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Bio"
                      fullWidth
                      multiline
                      rows={4}
                      defaultValue="I love cooking and exploring new recipes. Always looking for new food inspiration and ideas!"
                      variant="outlined"
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      label="Address"
                      fullWidth
                      defaultValue="123 Main St, Anytown, USA"
                      variant="outlined"
                      sx={{ mb: 3 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button 
                        variant="contained" 
                        sx={{ 
                          backgroundColor: '#FF6384',
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
              
              {value === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Notification Preferences
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 4 }}>
                    {[
                      { label: "Email Notifications", defaultChecked: true },
                      { label: "Push Notifications", defaultChecked: false },
                      { label: "Recipe Updates", defaultChecked: true },
                      { label: "Community Activity", defaultChecked: true }
                    ].map((item, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Paper sx={{ 
                          p: 2, 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          borderRadius: 2,
                          boxShadow: '0 1px 5px rgba(0,0,0,0.05)'
                        }}>
                          <Typography>{item.label}</Typography>
                          <FormControlLabel
                            control={
                              <Switch 
                                defaultChecked={item.defaultChecked} 
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#FF6384',
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#FF6384',
                                  },
                                }}
                              />
                            }
                            label=""
                          />
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                  
                  <Typography variant="h6" sx={{ mb: 3, mt: 4, fontWeight: 600 }}>
                    Content Preferences
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Paper sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        borderRadius: 2,
                        boxShadow: '0 1px 5px rgba(0,0,0,0.05)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Cuisine Type</Typography>
                        <TextField
                          select
                          fullWidth
                          defaultValue="all"
                          SelectProps={{
                            native: true,
                          }}
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        >
                          <option value="all">All Cuisines</option>
                          <option value="italian">Italian</option>
                          <option value="asian">Asian</option>
                          <option value="mexican">Mexican</option>
                          <option value="indian">Indian</option>
                        </TextField>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        borderRadius: 2,
                        boxShadow: '0 1px 5px rgba(0,0,0,0.05)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Difficulty Level</Typography>
                        <TextField
                          select
                          fullWidth
                          defaultValue="all"
                          SelectProps={{
                            native: true,
                          }}
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        >
                          <option value="all">All Levels</option>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </TextField>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        borderRadius: 2,
                        boxShadow: '0 1px 5px rgba(0,0,0,0.05)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Cooking Time</Typography>
                        <TextField
                          select
                          fullWidth
                          defaultValue="all"
                          SelectProps={{
                            native: true,
                          }}
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2
                            }
                          }}
                        >
                          <option value="all">Any Time</option>
                          <option value="quick">Under 30 mins</option>
                          <option value="medium">30-60 mins</option>
                          <option value="long">Over 60 mins</option>
                        </TextField>
                      </Paper>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <Button 
                      variant="contained" 
                      sx={{ 
                        backgroundColor: '#FF6384',
                        '&:hover': { backgroundColor: '#e55c7b' },
                        borderRadius: 8,
                        textTransform: 'none',
                        px: 4,
                        py: 1.2,
                        boxShadow: '0 4px 8px rgba(255,99,132,0.25)'
                      }}
                    >
                      Save Preferences
                    </Button>
                  </Box>
                </Box>
              )}
              
              {value === 2 && (
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      boxShadow: '0 1px 5px rgba(0,0,0,0.05)',
                      mb: { xs: 2, md: 0 }
                    }}>
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                        Change Password
                      </Typography>
                      <TextField
                        label="Current Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 3 }}
                      />
                      <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 3 }}
                      />
                      <TextField
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 3 }}
                      />
                      <Button 
                        variant="contained" 
                        sx={{ 
                          backgroundColor: '#FF6384',
                          '&:hover': { backgroundColor: '#e55c7b' },
                          borderRadius: 8,
                          textTransform: 'none',
                          px: 4,
                          py: 1.2,
                          boxShadow: '0 4px 8px rgba(255,99,132,0.25)'
                        }}
                      >
                        Update Password
                      </Button>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      boxShadow: '0 1px 5px rgba(0,0,0,0.05)',
                      mb: 3
                    }}>
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                        Two-Factor Authentication
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        mb: 2 
                      }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Enable 2FA
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Add an extra layer of security to your account.
                          </Typography>
                        </Box>
                        <Button 
                          variant="outlined"
                          sx={{ 
                            borderColor: '#FF6384',
                            color: '#FF6384',
                            borderRadius: 8,
                            '&:hover': { 
                              backgroundColor: 'rgba(255,99,132,0.05)',
                              borderColor: '#FF6384'
                            }
                          }}
                        >
                          Setup
                        </Button>
                      </Box>
                    </Paper>
                    
                    <Paper sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      boxShadow: '0 1px 5px rgba(0,0,0,0.05)'
                    }}>
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                        Connected Accounts
                      </Typography>
                      
                      {[
                        { name: "Facebook", color: "#1877F2", connected: false },
                        { name: "Twitter", color: "#1DA1F2", connected: false },
                        { name: "Google", color: "#DB4437", connected: true }
                      ].map((account, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          mb: index < 2 ? 3 : 0
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box 
                              sx={{ 
                                width: 36, 
                                height: 36, 
                                backgroundColor: account.color, 
                                borderRadius: '50%', 
                                mr: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                              }}
                            ></Box>
                            <Typography variant="body1">{account.name}</Typography>
                          </Box>
                          <Button 
                            variant={account.connected ? "contained" : "outlined"}
                            size="small"
                            sx={{ 
                              ...(account.connected ? {
                                backgroundColor: '#FF6384',
                                '&:hover': { backgroundColor: '#e55c7b' },
                              } : {
                                borderColor: '#FF6384',
                                color: '#FF6384',
                                '&:hover': { 
                                  backgroundColor: 'rgba(255,99,132,0.05)',
                                  borderColor: '#FF6384'
                                }
                              }),
                              borderRadius: 8,
                              textTransform: 'none'
                            }}
                          >
                            {account.connected ? "Connected" : "Connect"}
                          </Button>
                        </Box>
                      ))}
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ 
                      backgroundColor: 'rgba(244,67,54,0.03)', 
                      borderRadius: 2, 
                      p: 3,
                      border: '1px solid rgba(244,67,54,0.1)',
                      mt: 2
                    }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'error.main' }}>
                        Danger Zone
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 2, sm: 0 }
                      }}>
                        <Box sx={{ maxWidth: 600 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Delete Account
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Once you delete your account, there is no going back. Please be certain.
                          </Typography>
                        </Box>
                        <Button 
                          variant="outlined" 
                          color="error"
                          sx={{ 
                            borderRadius: 8,
                            textTransform: 'none'
                          }}
                        >
                          Delete Account
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default ProfilePage;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaHome, FaThList, FaChartBar, FaUser, FaHeart, FaCog } from "react-icons/fa";
import { Box, Typography, Button, TextField, IconButton, Avatar, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Grid, Paper, Tab, Tabs, Badge } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

const ProfilePage = () => {
  const [value, setValue] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userEmail = localStorage.getItem("userEmail") || "user1@example.com";
  const firstName = "Parichit";
  const lastName = "Shrestha";
  const navigate = useNavigate();

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

  const sidebarItems = [
    { text: 'Home', icon: <FaHome />, link: '/home' },
    { text: 'Categories', icon: <FaThList />, link: '/categories' },
    { text: 'Dashboard', icon: <FaChartBar />, link: '/dashboard' },
    { text: 'Profile', icon: <FaUser />, link: '/profile' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f7' }}>
      {/* Permanent Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#1a1a2e',
            color: '#fff'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          <img src="/images/logo.png" alt="Logo" style={{ width: 40, height: 40 }} />
          <Typography variant="h5" sx={{ ml: 2, fontWeight: 'bold', color: '#fff' }}>
            YOO!!!
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        <List>
          {sidebarItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              component={Link} 
              to={item.link}
              sx={{ 
                color: '#fff',
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderLeft: '4px solid #ff9800'
                },
                ...(window.location.pathname === item.link && {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderLeft: '4px solid #ff9800'
                })
              }}
            >
              <ListItemIcon sx={{ color: '#ff9800' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ marginTop: 'auto', padding: 2 }}>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleLogout}
            sx={{ 
              backgroundColor: '#ff9800',
              '&:hover': { backgroundColor: '#f57c00' }
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={toggleSidebar}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#1a1a2e',
            color: '#fff'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="/images/logo.png" alt="Logo" style={{ width: 40, height: 40 }} />
            <Typography variant="h5" sx={{ ml: 2, fontWeight: 'bold', color: '#fff' }}>
              YOO!!!
            </Typography>
          </Box>
          <IconButton onClick={toggleSidebar} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        <List>
          {sidebarItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              component={Link} 
              to={item.link}
              onClick={toggleSidebar}
              sx={{ 
                color: '#fff',
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderLeft: '4px solid #ff9800'
                },
                ...(window.location.pathname === item.link && {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderLeft: '4px solid #ff9800'
                })
              }}
            >
              <ListItemIcon sx={{ color: '#ff9800' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ marginTop: 'auto', padding: 2 }}>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleLogout}
            sx={{ 
              backgroundColor: '#ff9800',
              '&:hover': { backgroundColor: '#f57c00' }
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', padding: { xs: 2, md: 4 } }}>
        {/* Mobile Header */}
        <Box sx={{ 
          display: { xs: 'flex', md: 'none' }, 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 2,
          backgroundColor: '#fff',
          padding: 1,
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <IconButton onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Profile
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton sx={{ mr: 1 }}>
              <Badge badgeContent={3} color="error">
                <FaBell />
              </Badge>
            </IconButton>
            <IconButton onClick={toggleUserMenu}>
              <Avatar sx={{ width: 30, height: 30, bgcolor: '#ff9800' }}>
                {firstName ? firstName.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Box>

        {/* Page Title */}
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold', 
          marginBottom: 3, 
          display: { xs: 'none', md: 'block' },
          color: '#333'
        }}>
          My Profile
        </Typography>

        {/* Profile Header */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-start' },
          backgroundColor: '#fff', 
          padding: 4, 
          borderRadius: 3,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: 3
        }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120, 
                bgcolor: '#ff9800',
                fontSize: '3rem',
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
                backgroundColor: '#ff9800',
                color: '#fff',
                '&:hover': { backgroundColor: '#f57c00' }
              }}
            >
              <EditIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ 
            ml: { xs: 0, md: 4 }, 
            mt: { xs: 2, md: 0 },
            textAlign: { xs: 'center', md: 'left' },
            flexGrow: 1
          }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {firstName} {lastName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
              {userEmail}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, maxWidth: 600 }}>
              I love cooking and exploring new recipes. Always looking for new food inspiration and ideas!
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Button 
                variant="contained" 
                startIcon={<EditIcon />}
                sx={{ 
                  backgroundColor: '#ff9800',
                  '&:hover': { backgroundColor: '#f57c00' },
                  borderRadius: 8,
                  textTransform: 'none'
                }}
              >
                Edit Profile
              </Button>
              <Button 
                variant="outlined" 
                sx={{ 
                  borderColor: '#ff9800',
                  color: '#ff9800',
                  '&:hover': { 
                    backgroundColor: 'rgba(255,152,0,0.1)',
                    borderColor: '#ff9800'
                  },
                  borderRadius: 8,
                  textTransform: 'none'
                }}
              >
                Activity Log
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center', 
            gap: 2
          }}>
            <IconButton>
              <Badge badgeContent={3} color="error">
                <FaBell />
              </Badge>
            </IconButton>
            <IconButton>
              <FaCog />
            </IconButton>
          </Box>
        </Box>

        {/* Profile Content */}
        <Box sx={{ backgroundColor: '#fff', borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={value} 
              onChange={handleTabChange} 
              variant="fullWidth"
              sx={{ 
                '& .MuiTab-root': { 
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                },
                '& .Mui-selected': { color: '#ff9800' },
                '& .MuiTabs-indicator': { backgroundColor: '#ff9800' }
              }}
            >
              <Tab label="Personal Info" />
              <Tab label="Preferences" />
              <Tab label="Security" />
            </Tabs>
          </Box>
          
          <Box sx={{ p: 3 }}>
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
                        backgroundColor: '#ff9800',
                        '&:hover': { backgroundColor: '#f57c00' },
                        borderRadius: 8,
                        textTransform: 'none',
                        px: 4
                      }}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            )}
            
            {value === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Notification Preferences
                  </Typography>
                  <Box sx={{ mb: 4 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography>Email Notifications</Typography>
                          <Button 
                            variant="contained"
                            size="small"
                            sx={{ 
                              backgroundColor: '#ff9800',
                              '&:hover': { backgroundColor: '#f57c00' }
                            }}
                          >
                            On
                          </Button>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography>Push Notifications</Typography>
                          <Button 
                            variant="outlined"
                            size="small"
                            sx={{ 
                              borderColor: '#ff9800',
                              color: '#ff9800',
                              '&:hover': { borderColor: '#f57c00', color: '#f57c00' }
                            }}
                          >
                            Off
                          </Button>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography>Recipe Updates</Typography>
                          <Button 
                            variant="contained"
                            size="small"
                            sx={{ 
                              backgroundColor: '#ff9800',
                              '&:hover': { backgroundColor: '#f57c00' }
                            }}
                          >
                            On
                          </Button>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography>Community Activity</Typography>
                          <Button 
                            variant="contained"
                            size="small"
                            sx={{ 
                              backgroundColor: '#ff9800',
                              '&:hover': { backgroundColor: '#f57c00' }
                            }}
                          >
                            On
                          </Button>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Typography variant="h6" sx={{ mb: 2, mt: 4, fontWeight: 'bold' }}>
                    Content Preferences
                  </Typography>
                  <Box sx={{ mb: 4 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Cuisine Type</Typography>
                          <TextField
                            select
                            fullWidth
                            defaultValue="all"
                            SelectProps={{
                              native: true,
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
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Difficulty Level</Typography>
                          <TextField
                            select
                            fullWidth
                            defaultValue="all"
                            SelectProps={{
                              native: true,
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
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Cooking Time</Typography>
                          <TextField
                            select
                            fullWidth
                            defaultValue="all"
                            SelectProps={{
                              native: true,
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
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <Button 
                      variant="contained" 
                      sx={{ 
                        backgroundColor: '#ff9800',
                        '&:hover': { backgroundColor: '#f57c00' },
                        borderRadius: 8,
                        textTransform: 'none',
                        px: 4
                      }}
                    >
                      Save Preferences
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            )}
            
            {value === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
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
                      backgroundColor: '#ff9800',
                      '&:hover': { backgroundColor: '#f57c00' },
                      borderRadius: 8,
                      textTransform: 'none'
                    }}
                  >
                    Update Password
                  </Button>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Two-Factor Authentication
                  </Typography>
                  <Paper sx={{ p: 3, mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Enable 2FA
                      </Typography>
                      <Button 
                        variant="outlined"
                        sx={{ 
                          borderColor: '#ff9800',
                          color: '#ff9800',
                          '&:hover': { 
                            backgroundColor: 'rgba(255,152,0,0.1)',
                            borderColor: '#ff9800'
                          }
                        }}
                      >
                        Setup
                      </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Add an extra layer of security to your account by requiring a verification code in addition to your password.
                    </Typography>
                  </Paper>
                  
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Connected Accounts
                  </Typography>
                  <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 30, height: 30, backgroundColor: '#1877F2', borderRadius: '50%', mr: 2 }}></Box>
                        <Typography>Facebook</Typography>
                      </Box>
                      <Button 
                        variant="outlined"
                        size="small"
                        sx={{ 
                          borderColor: '#ff9800',
                          color: '#ff9800'
                        }}
                      >
                        Connect
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 30, height: 30, backgroundColor: '#1DA1F2', borderRadius: '50%', mr: 2 }}></Box>
                        <Typography>Twitter</Typography>
                      </Box>
                      <Button 
                        variant="outlined" 
                        size="small"
                        sx={{ 
                          borderColor: '#ff9800',
                          color: '#ff9800'
                        }}
                      >
                        Connect
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 30, height: 30, backgroundColor: '#DB4437', borderRadius: '50%', mr: 2 }}></Box>
                        <Typography>Google</Typography>
                      </Box>
                      <Button 
                        variant="contained" 
                        size="small"
                        sx={{ 
                          backgroundColor: '#ff9800'
                        }}
                      >
                        Connected
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ borderTop: '1px solid #eee', pt: 4, mt: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'error.main' }}>
                      Danger Zone
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
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
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
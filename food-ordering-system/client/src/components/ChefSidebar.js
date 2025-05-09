import React, { useState, memo } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Button, 
  Divider, 
  IconButton, 
  useTheme,
  useMediaQuery,
  Avatar,
  Badge,
  Collapse
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { 
  FaHome, 
  FaThList, 
  FaChartBar, 
  FaUser, 
  FaHeart, 
  FaHistory, 
  FaWallet, 
  FaMapMarkerAlt, 
  FaHeadset, 
  FaTicketAlt,
  FaCog,
  FaUtensils
} from 'react-icons/fa';

const SidebarContent = memo(({ mobile = false, handleLogout, toggleSidebar }) => {
  const location = useLocation();
  const [openSubMenu, setOpenSubMenu] = useState('');
  const userEmail = localStorage.getItem("userEmail") || "user@example.com";
  const userName = userEmail.split('@')[0];
  const userInitial = userName.charAt(0).toUpperCase();

  const toggleSubMenu = (menuText) => {
    setOpenSubMenu(openSubMenu === menuText ? '' : menuText);
  };

  const mainMenuItems = [
    { text: 'Dashboard', icon: <FaChartBar size={20} />, link: '/chef-dashboard' },
    { text: 'Upload Tutorials', icon: <FaUtensils size={20} />, link: '/tutorial-upload' },
    // { text: 'Categories', icon: <FaThList size={20} />, link: '/categories' },
  ];
  
  const userMenuItems = [
    { 
      text: 'My Account', 
      icon: <FaUser size={20} />, 
      link: '/chef-profile',
      submenu: [
        { text: 'Profile', icon: <FaUser size={16}/>, link: '/chef-profile' },
        // { text: 'Addresses', icon: <FaMapMarkerAlt size={16} />, link: '/addresses' },
        // { text: 'Payment Methods', icon: <FaWallet size={16} />, link: '/payment-methods' },
      ]
    },
    { text: 'Orders', icon: <FaHistory size={20} />, link: '/chef-orders' },
    // { text: 'Favorites', icon: <FaHeart size={20} />, link: '/favorites' },
    // { text: 'Offers & Promos', icon: <FaTicketAlt size={20} />, link: '/offers' },
  ];
  
  const supportMenuItems = [
    { text: 'Help Center', icon: <FaHeadset size={20} />, link: '/chef-contact' },
    { text: 'Settings', icon: <FaCog size={20} />, link: '/settings' },
  ];

  const listItemStyle = (itemLink) => ({
    color: '#fff',
    borderRadius: '8px',
    margin: '4px 8px',
    paddingLeft: '16px',
    '&:hover': { 
      backgroundColor: 'rgba(255,255,255,0.12)',
    },
    ...(location.pathname === itemLink && {
      backgroundColor: 'rgba(255,99,132,0.15)',
      borderLeft: '4px solid #ff9800',
      paddingLeft: '12px',
    })
  });

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      overflow: 'auto',
      // Add custom scrollbar styles
      '&::-webkit-scrollbar': {
        width: '8px',
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '4px',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.3)',
        },
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      // For Firefox
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent',
    }}>
      {/* Logo and App Title */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: mobile ? 'space-between' : 'flex-start', 
        padding: 2 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={() => window.location.href = '/home'}>
            <img src="/images/logo1.png" alt="Logo" style={{ width: 50, height: 45 }}/>
          {/* <Typography variant="h5" sx={{ ml: 2, fontWeight: 'bold', color: '#fff' }}>
            YOO!!!
          </Typography> */}
        </Box>
        {mobile && (
          <IconButton onClick={toggleSidebar} sx={{ color: '#ff9800' }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      
      {/* User Profile Section */}
      <Box sx={{ 
        p: 2, 
        mt: 1, 
        mx: 2, 
        bgcolor: 'rgba(255,255,255,0.05)', 
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        position: 'relative'
      }}>
        <Avatar sx={{ 
          bgcolor: '#ff9800', 
          width: 44, 
          height: 44,
          border: '2px solid rgba(255,255,255,0.2)'
        }}>
          {userInitial}
        </Avatar>
        <Box sx={{ ml: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
            {userName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.2 }}>
            Food Enthusiast
          </Typography>
        </Box>
        <IconButton 
          size="small"
          sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8, 
            color: 'rgba(255,255,255,0.7)' 
          }}
        >
          <Badge badgeContent={3} color="error">
            <NotificationsIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Box>
      
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.08)', my: 2 }} />
      
      {/* Main Menu */}
      <Typography variant="overline" sx={{ px: 3, color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>
        Main Menu
      </Typography>
      <List sx={{ px: 1 }}>
        {mainMenuItems.map((item) => (
          <ListItem 
            key={item.text} 
            component={Link} 
            to={item.link}
            onClick={mobile ? toggleSidebar : undefined}
            disablePadding
            sx={listItemStyle(item.link)}
            style={{ height: '40px' }}
          >
            <ListItemIcon sx={{ color: '#ff9800', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.08)', my: 2 }} />
      
      {/* User Menu */}
      <Typography variant="overline" sx={{ px: 3, color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>
        Your Account
      </Typography>
      <List sx={{ px: 1 }}>
        {userMenuItems.map((item) => (
          <React.Fragment key={item.text}>
            <ListItem 
              component={item.submenu ? 'div' : Link}
              to={item.submenu ? undefined : item.link}
              onClick={item.submenu ? () => toggleSubMenu(item.text) : mobile ? toggleSidebar : undefined}
              disablePadding
              sx={listItemStyle(item.link)}
              style={{ height: '40px' }}
            >
              <ListItemIcon sx={{ color: '#ff9800', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
              {item.submenu && (
                openSubMenu === item.text ? <ExpandLessIcon /> : <ExpandMoreIcon />
              )}
            </ListItem>
            
            {item.submenu && (
              <Collapse in={openSubMenu === item.text} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.submenu.map((subItem) => (
                    <ListItem
                      key={subItem.text}
                      component={Link}
                      to={subItem.link}
                      onClick={mobile ? toggleSidebar : undefined}
                      disablePadding
                      sx={{
                        pl: 6,
                        ...listItemStyle(subItem.link),
                        borderRadius: '8px',
                        margin: '2px 16px 2px 24px',
                      }}
                    >
                      {subItem.icon && (
                        <ListItemIcon sx={{ color: '#ff9800', minWidth: 32 }}>
                          {subItem.icon}
                        </ListItemIcon>
                      )}
                      <ListItemText 
                        primary={subItem.text} 
                        primaryTypographyProps={{ 
                          variant: 'body2',
                          sx: { fontWeight: location.pathname === subItem.link ? 'bold' : 'normal' }
                        }} 
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
      
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.08)', my: 2 }} />
      
      {/* Support Menu */}
      <Typography variant="overline" sx={{ px: 3, color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>
        Support
      </Typography>
      <List sx={{ px: 1, }}>
        {supportMenuItems.map((item) => (
          <ListItem 
            key={item.text} 
            component={Link} 
            to={item.link}
            onClick={mobile ? toggleSidebar : undefined}
            disablePadding
            sx={listItemStyle(item.link)}
            style={{ height: '40px' }}
          >
            <ListItemIcon sx={{ color: '#ff9800', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ 
        margin: '16px 16px 24px 16px', 
        padding: '16px', 
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #FF9F1C 0%, #FFBF69 100%)',
        boxShadow: '0 4px 12px rgba(255,99,132,0.3)',
        textAlign: 'center',
      }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'white', fontWeight: 'bold' }}>
          Need Help?
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)' }}>
          Our support team is just a click away
        </Typography>
        <Button 
          variant="contained" 
          fullWidth 
          sx={{ 
            backgroundColor: 'white',
            color: '#FF6384',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
          }}
        >
          Contact Support
        </Button>
      </Box>
      
      {/* Logout Button */}
      <Box sx={{ padding: '0 16px 24px 16px', mt: 'auto' }}>
        <ListItem
          onClick={handleLogout}
          disablePadding
          sx={{
            display: 'block',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          <Button 
            variant="contained" 
            fullWidth 
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: 'white',
              borderRadius: '8px',
              height: '48px',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)' }
            }}
          >
            Logout
          </Button>
        </ListItem>
      </Box>
    </Box>
  );
});

const ChefSidebar = memo(({ sidebarOpen, toggleSidebar, handleLogout }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Common styles for both sidebars
  const drawerPaperStyle = {
    width: 280,
    boxSizing: 'border-box',
    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
    color: '#fff',
    boxShadow: '0 0 20px rgba(0,0,0,0.3)'
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: 280,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': drawerPaperStyle
        }}
      >
        <SidebarContent handleLogout={handleLogout} toggleSidebar={toggleSidebar} />
      </Drawer>

      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={toggleSidebar}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            ...drawerPaperStyle,
            borderRadius: '0 16px 16px 0',
          }
        }}
        ModalProps={{
          keepMounted: true
        }}
      >
        <SidebarContent mobile={true} handleLogout={handleLogout} toggleSidebar={toggleSidebar} />
      </Drawer>
    </>
  );
});

ChefSidebar.displayName = 'ChefSidebar';
SidebarContent.displayName = 'ChefSidebarContent';

export default ChefSidebar;
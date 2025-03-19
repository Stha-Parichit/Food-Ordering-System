import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Paper, TextField,  Drawer, List, ListItem, ListItemText} from "@mui/material";
import { FaBell } from "react-icons/fa";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Users = [
  { id: 1, name: "Satkar Shrestha", user: "Customer" },
  { id: 2, name: "Sanju Shrestha", user: "Customer" },
  { id: 3, name: "Parichit Shrestha", user: "Chef" },
  { id: 4, name: "Raj Pradhan", user: "Customer" },
  { id: 5, name: "Biplab Shah", user: "Chef" }
];

export default function RegisteredUser() {
  const handleOnClick = (user) => {
    alert(`You clicked on ${user.name} (${user.user})`);
  };

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const userEmail = localStorage.getItem("userEmail");
  const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "";
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    document.title = "Registered User";
    const link = document.querySelector("link[rel*='icon']");
    link.href = "./images/logo.png";
  }, []);

  // Profile Dropdown Handlers
  const handleMouseEnter = () => setIsDropdownVisible(true);
  const handleMouseLeave = () => setIsDropdownVisible(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login"); // Use navigate instead of window.location.href
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const profileDropdown = document.querySelector(".profile-dropdown");
      const profileIcon = document.querySelector(".profile-icon-container");
      if (
        profileDropdown &&
        !profileDropdown.contains(e.target) &&
        !profileIcon.contains(e.target)
      ) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const [activeTab, setActiveTab] = useState("Reg. user");
  const handleTabActive = (tab) => {
    setActiveTab(tab);
  };

  // Sidebar state (Open/Close)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle sidebar toggling and close when clicking outside
    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
    };
  
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("sidebar");
      const sidebarButton = document.getElementById("sidebar-toggle-button");
      if (sidebar && !sidebar.contains(event.target) && !sidebarButton.contains(event.target)) {
        setSidebarOpen(false);
      }
    };
  
    useEffect(() => {
      if (sidebarOpen) {
        document.addEventListener("click", handleClickOutside);
      } else {
        document.removeEventListener("click", handleClickOutside);
      }
      return () => document.removeEventListener("click", handleClickOutside);
    }, [sidebarOpen]);

  const handleClickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Header */}
        <AppBar position="sticky" sx={{ backgroundColor: "#fff", color: "#333", width: "100%" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                id="sidebar-toggle-button"
                sx={{ color: "#333" }}
                onClick={toggleSidebar}
              >
                ☰
              </Button>
              <img src="/images/logo.png" alt="Logo" style={{ width: 40, height: 40, marginLeft: "1rem" }} />
              <Typography variant="h6" sx={{ ml: 2, color: "#333" }}>
                YOO!!!
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mx: "auto" }}>
              <Button sx={{ color: "#333" }} component="a" href="/home">
                Home
              </Button>
              <Button sx={{ color: "#333" }} component="a" href="/categories">
                Categories
              </Button>
              <Button sx={{ color: "#333" }} component="a" href="/dashboard">
                Dashboard
              </Button>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search"
                InputProps={{
                  endAdornment: <SearchIcon />,
                }}
                sx={{ bgcolor: "white", borderRadius: 1, mr: 2 }}
              />
              <FaBell style={{ fontSize: "1.5rem", color: "#333" }} />
              <IconButton onClick={handleClickProfile}>
                <AccountCircleIcon sx={{ fontSize: "2rem", color: "#333" }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseProfileMenu}
                sx={{ mt: 2 }}
              >
                <MenuItem>{userEmail}</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: "flex", flexGrow: 1 }}>
          {/* Sidebar */}
          <Drawer
            id="sidebar"
            sx={{
              width: 240,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: 240,
                boxSizing: "border-box",
              },
            }}
            variant="persistent"
            anchor="left"
            open={sidebarOpen}
          >
            <List style={{cursor: "pointer"}}>
              <ListItem button onClick={() => navigate("/registered-user")}>
                <ListItemText primary="Registered Users" />
              </ListItem>
              <ListItem button onClick={() => navigate("/blocked-users")}>
                <ListItemText primary="Blocked Users" />
              </ListItem>
            </List>
          </Drawer>

          <Box sx={{ flex: 1, padding: 5 }}>
            <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
              <Typography variant="h4" align="center" gutterBottom>
                All Users
              </Typography>
              <ul>
                {Users.map((user) => (
                  <li key={user.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span>{user.name}</span>
                    <Button variant="outlined" onClick={() => handleOnClick(user)}>
                      {user.user}
                    </Button>
                  </li>
                ))}
              </ul>
            </Paper>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ backgroundColor: "#f0f0f0", padding: 3, textAlign: "center", bottom: 0, left: 0, width: "100%" }}>
          <Typography variant="body2">© YOO!!! All Rights Reserved</Typography>
          <Typography variant="body2">🍴 YOO!!!</Typography>
          <Typography variant="body2">
            Disclaimer: This site is only for ordering and learning to cook food.
          </Typography>
        </Box>
      </Box>
    </>
  );
}
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { Box, AppBar, Toolbar, Typography, Button, TextField, Link, IconButton, Menu, MenuItem, Paper, Drawer, List, ListItem, ListItemText } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const ProfilePage = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userEmail = localStorage.getItem("userEmail");
  const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "";
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "User profile - YOO!!!";
    const link = document.querySelector("link[rel*='icon']");
    link.href = "./images/logo.png";
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

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

  return (
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
              <Link to="/profile" style={{ textDecoration: "none", color: "black" }}>
                <MenuItem>Profile</MenuItem>
              </Link>
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
          <List>
            <ListItem button onClick={() => navigate("/profile")}>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={() => navigate("/liked")}>
              <ListItemText primary="Liked" />
            </ListItem>
          </List>
        </Drawer>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ padding: 3 }}>
            <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
              <Typography variant="h4" align="center" gutterBottom>
                Profile
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Box sx={{ fontSize: "4rem", marginBottom: 2 }}>😊</Box>
                  <Box>
                    <Button variant="outlined" sx={{ marginRight: 2 }}>
                      Edit Pic
                    </Button>
                    <Button variant="outlined" color="error">
                      Delete Pic
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ width: "100%", marginTop: 4 }}>
                  <TextField label="First Name" fullWidth defaultValue="Parichit" sx={{ marginBottom: 2 }} />
                  <TextField label="Last Name" fullWidth defaultValue="Shrestha" sx={{ marginBottom: 2 }} />
                  <TextField label="Email" fullWidth defaultValue="user1@example.com" sx={{ marginBottom: 2 }} />
                  <TextField
                    label="Bio"
                    fullWidth
                    multiline
                    rows={4}
                    defaultValue="I love cooking"
                    sx={{ marginBottom: 2 }}
                  />
                  <Button variant="contained" fullWidth>
                    Save
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: "center", p: 3, backgroundColor: "#f0f0f0", width: "100%" }}>
        <Typography variant="body2">© YOO!!! All Rights Reserved</Typography>
        <Typography variant="body2">🍴 YOO!!!</Typography>
        <Typography variant="body2">
          Disclaimer: This site is only for ordering and learning to cook food.
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfilePage;

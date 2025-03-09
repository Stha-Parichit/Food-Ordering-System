import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const UploadFood = () => {
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const userEmail = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin Dashboard";
    const link = document.querySelector("link[rel*='icon']");
    link.href = "./images/logo.png";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const formData = new FormData();
    formData.append("foodName", foodName);
    formData.append("description", description);
    formData.append("details", details);
    formData.append("price", price);
    if (image) formData.append("image", image);
  
    try {
      const response = await axios.post("http://localhost:5000/upload-food", formData);
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to upload food item.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleClickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="sticky" sx={{ backgroundColor: "#fff", color: "#333" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src="/images/logo.png" alt="Logo" style={{ width: 40, height: 40 }} />
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
              <MenuItem onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("userEmail"); navigate("/login"); }}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Box sx={{ flex: 1, padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Upload New Food Item
        </Typography>
        {message && <Typography color="error">{message}</Typography>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField
            label="Food Name"
            variant="outlined"
            fullWidth
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            label="Details"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            sx={{ marginBottom: 2 }}
            required
            type="number"
            inputProps={{ step: "1" }}
          />
          <Button
            variant="contained"
            component="label"
            sx={{ marginBottom: 2 }}
          >
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Button>

          <Box sx={{ marginBottom: 2 }}>
            {image && (
              <Typography variant="body2" sx={{ color: "gray" }}>
                {image.name}
              </Typography>
            )}
          </Box>

          <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Upload"}
          </Button>
        </form>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: "#f0f0f0", padding: 3, textAlign: "center" }}>
        <Typography variant="body2">© YOO!!! All Rights Reserved</Typography>
        <Typography variant="body2">🍴 YOO!!!</Typography>
        <Typography variant="body2">
          Disclaimer: This site is only for ordering and learning to cook food.
        </Typography>
      </Box>
    </Box>
  );
};

export default UploadFood;

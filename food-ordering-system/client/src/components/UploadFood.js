import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import "./UploadFood.css";

const UploadFood = () => {
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const userEmail = localStorage.getItem("userEmail");
  const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "";
  const navigate = useNavigate();

  useEffect(() => {
            document.title = "Admin Dashboard";
            const link = document.querySelector("link[rel*='icon']");
            link.href = "./images/logo.png";
        }, []);

  // Profile Dropdown Handlers
    const handleMouseEnter = () => setIsDropdownVisible(true);
    const handleMouseLeave = () => setIsDropdownVisible(false);
  
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        navigate("/login");  // Use navigate instead of window.location.href
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
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/upload-food", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to upload food item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="upload-food-container">
      <header className="home-header">
              <div className="home-logo">
                <img src="/images/logo.png" alt="Logo" />
                  <span>YOO!!!</span>
              </div>
              <nav className="home-nav-links">
                <a href="/home">Home</a>
                <a href="/categories">Categories</a>
                <a href="/dashboard">Dashboard</a>
                <div className="user-search-bar">
                  <input type="text" placeholder="Search" />
                  <button>🔍</button>
                </div>
              </nav>
              <div className="header-right">
                <FaBell className="notification-icon" />
                <div
                  className="profile-icon-container"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => setIsDropdownVisible(!isDropdownVisible)}
                >
                  <span className="profile-icon">{firstLetter}</span>
                    {isDropdownVisible && (
                    <div className="profile-dropdown">
                      <p>{userEmail}</p>
                      <a href="/profile">View Profile</a>
                      <button onClick={handleLogout}>Logout</button>
                    </div>
                    )}
                </div>
              </div>
            </header>
      <h2>Upload New Food Item</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="upload-food-form">
        <div className="form-group">
          <label>Food Name:</label>
          <input
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Details:</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Uploading..." : "Upload"}
        </button>
      </form>
      {/* Footer Section */}
      <footer className="home-footer">
        <p>© RecipeShare All Rights Reserved</p>
        <p>🍴 YOO!!!</p>
        <p>
          Disclaimer: This site is only for ordering and learning to cook food.
        </p>
      </footer>
    </div>
  );
};

export default UploadFood;

import React from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
  return (
    <div className="profile-container">
      {/* Navigation Bar */}
      <nav className="nav-bar">
        <div className="nav-left">
          <div className="logo">📝</div>
          <div className="search-container">
            <input type="text" placeholder="Search" className="search-input" />
            <button className="filter-btn">Filter ▼</button>
          </div>
        </div>
        <div className="nav-right">
          <div className="notification-icon">🔔</div>
          <div className="profile-icon">😊</div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <h1>Settings</h1>
          <div className="sidebar-menu">
            <div className="menu-item active">Profile</div>
            <div className="menu-item">Liked</div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="profile-section">
          <h2>Profile</h2>
          
          <div className="profile-pic-section">
            <div className="profile-pic">😊</div>
            <div className="profile-pic-buttons">
              <button className="edit-pic-btn">Edit pic</button>
              <button className="delete-pic-btn">Delete pic</button>
            </div>
          </div>

          <div className="profile-form">
            <div className="name-fields">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" value="Parichit" />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" value="Shrestha" />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" value="user1@example.com" />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea value="I love cooking"></textarea>
            </div>

            <div className="save-button-container">
              <button className="save-btn">Save</button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="copyright">
            Copyright © RecipeShare. All Rights Reserved
          </div>
          <div className="footer-links">
            <a href="#">Contact</a>
            <a href="#">Blog</a>
          </div>
        </div>
      </footer>

      {/* Logo and Disclaimer */}
      <div className="bottom-section">
        <div className="bottom-logo">
          <span className="logo-icon">📝</span>
          <span className="logo-text">YOO!!!</span>
        </div>
        <p className="disclaimer">
          Disclaimer: This site is only for ordering and learning to cook food.
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
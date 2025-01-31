import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    const monthlyData = [
        { month: 'Jan', orders: 20, amount: 10000 },
        { month: 'May', orders: 40, amount: 8000 },
        { month: 'Aug', orders: 50, amount: 10000 },
        { month: 'Dec', orders: 40, amount: 8000 }
    ];
  
      
      const userEmail = localStorage.getItem('userEmail');
      const [isDropdownVisible, setIsDropdownVisible] = useState(false);
      const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : ''
      
        const handleMouseEnter = () => setIsDropdownVisible(true);
        const handleMouseLeave = () => setIsDropdownVisible(false);
      
        const handleLogout = () => {
          localStorage.removeItem('token');
          localStorage.removeItem('userEmail');
          window.location.href = '/login';
        };
      
        useEffect(() => {
          const handleClickOutside = (e) => {
            const profileDropdown = document.querySelector('.profile-dropdown');
            const profileIcon = document.querySelector('.profile-icon-container');
            if (profileDropdown && !profileDropdown.contains(e.target) && !profileIcon.contains(e.target)) {
              setIsDropdownVisible(false);
            }
          };
      
          document.addEventListener('click', handleClickOutside);
          return () => {
            document.removeEventListener('click', handleClickOutside);
          };
        }, []);

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src="/images/logo.png" alt="Logo" />
          <span>YOO!!!</span>
        </div>
        <nav className="nav-links">
          <a href="/home">Home</a>
          <a href="/categories">Categories</a>
          <a href="/dashboard">Dashboard</a>
          <div className="search-bar">
            <input type="text" placeholder="Search" />
            <button>🔍</button>
          </div>
        </nav>
        <div className="header-right">
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

      <h1 className="dashboard-title">My Impact</h1>

      {/* Impact Stats */}
      <div className="impact-grid">
        <div className="impact-card">
          <div className="icon heart-icon">❤️</div>
          <div className="impact-content">
            <div className="impact-value">Rs. 15000</div>
            <div className="impact-label">Donated to the community needs</div>
          </div>
        </div>

        <div className="impact-card">
          <div className="icon gift-icon">🎁</div>
          <div className="impact-content">
            <div className="impact-value">8</div>
            <div className="impact-label">Loyalty Stamps</div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="summary-grid">
        <div className="summary-card">
          <h3 className="summary-label">Total orders</h3>
          <div className="summary-value">50</div>
        </div>

        <div className="summary-card">
          <h3 className="summary-label">Total spent</h3>
          <div className="summary-value">Rs. 60000</div>
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="performance-card">
        <div className="performance-header">
          <span className="star">⭐</span>
          Monthly Performance
        </div>
        <div className="performance-content">
          {monthlyData.map((data, index) => (
            <div key={index} className="performance-item">
              <div className="month-label">{data.month}</div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar"
                  style={{ width: `${(data.orders / 50) * 100}%` }}
                ></div>
              </div>
              <div className="orders-label">
                {data.orders} orders (Rs. {data.amount})
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="copyright">Copyright © BaseSystem All Rights Reserved</div>
        <div className="footer-links">
          <span>Contact</span>
          <span>Blog</span>
        </div>
        <div className="footer-logo">YOO!!!</div>
        <div className="disclaimer">
          Disclaimer: This site is only for ordering and learning to cook food
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
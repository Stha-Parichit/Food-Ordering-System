import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaGift, FaChartBar, FaBolt, FaMedal, FaBell } from "react-icons/fa";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminDashboard = () => {
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

  const pieData = {
    labels: ["Local Food Bank", "Total Active Users", "Community Meals"],
    datasets: [
      {
        data: [440500, 44500, 35500],
        backgroundColor: ["#FFD700", "#DC143C", "#32CD32", "#6A0DAD"],
      },
    ],
  };

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Monthly Revenue",
        data: [400000, 450000, 380000, 500000],
        backgroundColor: "#007BFF",
      },
    ],
  };

  return (
    <div className="dashboard">
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

      <h1 className="title">Impact Dashboard</h1>

      <section className="charity">
        <h2><FaHeart /> Charity Contributions</h2>
        <Pie data={pieData} className="small-pie-chart"/>
        <div className="stats">
          <p>Rs. 440500 <br /> Local Food Bank</p>
          <p> 44500 <br /> Total Active Users</p>
          <p>Rs. 35500 <br /> Community Meals</p>
        </div>
      </section>

      <section className="loyalty">
        <h2><FaGift /> Loyalty Program</h2>
        <div className="loyalty-cards">
          <div className="card"><FaBolt /> 4500 <br /> Total Active Users</div>
          <div className="card"><FaMedal /> 30000 <br /> Stamps Redeemed</div>
        </div>
      </section>

      <section className="revenue">
        <h2><FaChartBar /> Monthly Revenue</h2>
        <Bar data={barData} />
      </section>

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

export default AdminDashboard;
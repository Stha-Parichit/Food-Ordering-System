import React, { useState, useEffect } from 'react';
import './FilterPage.css';

const FilterPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
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
    <div className="filter-page">
      <header className="header">
        <div className="logo">YOO!!!</div>
        <div className="nav">
          <a href="/home">Home</a>
          <a href="/category">Category</a>
          <a href="/dashboard">Dashboard</a>
          <div className="search-container">
            <input type="text" placeholder="Search" />
            <button>Search</button>
          </div>
          <div className="user-actions">
            <button>Filter</button>
            <button>Notification</button>
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
        </div>
      </header>

      <main className="main">
        <section className="food-categories">
          <h2>Food categories</h2>
          <div className="category-icons">
            <div className="category-icon">
              <img src="/images/snacks.png" alt="Snacks" />
              <span>Snacks</span>
            </div>
            <div className="category-icon">
              <img src="/images/breakfast.png" alt="Breakfast" />
              <span>Breakfast</span>
            </div>
            <div className="category-icon">
              <img src="/images/lunch.png" alt="Lunch" />
              <span>Lunch</span>
            </div>
            <div className="category-icon">
              <img src="/images/nonVeg.png" alt="Pork" />
              <span>Pork</span>
            </div>
            <div className="category-icon">
              <img src="/images/veg.png" alt="Veg" />
              <span>Veg</span>
            </div>
          </div>
        </section>

        <section className="recommended-items">
          <h2>Some foods you may like</h2>
          <div className="item-grid">
            <div className="item-card">
              <img src="/images/pizza.png" alt="Pizza" />
              <span>Pizza</span>
            </div>
            <div className="item-card">
              <img src="pasta.png" alt="Pasta" />
              <span>Pasta</span>
            </div>
            <div className="item-card">
              <img src="cup-cake.png" alt="Cup Cake" />
              <span>Cup Cake</span>
            </div>
            <div className="item-card">
              <img src="cake.png" alt="Cake" />
              <span>Cake</span>
            </div>
          </div>
        </section>

        <section className="recent-items">
          <h2>Recent items</h2>
          <div className="item-grid">
            <div className="item-card">
              <img src="burger.png" alt="Burger" />
              <span>Burger</span>
            </div>
            <div className="item-card">
              <img src="pizza.png" alt="Pizza" />
              <span>Pizza</span>
            </div>
            <div className="item-card">
              <img src="omurice.png" alt="Omurice" />
              <span>Omurice</span>
            </div>
            <div className="item-card">
              <img src="sushi.png" alt="Sushi" />
              <span>Sushi</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="copyright">Copyright @ YOO!!! All Rights Reserved</div>
        <div className="links">
          <a href="#">Contact</a>
          <a href="#">Blog</a>
        </div>
      </footer>
    </div>
  );
};

export default FilterPage;
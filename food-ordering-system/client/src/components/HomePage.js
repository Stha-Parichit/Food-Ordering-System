import React, { useState, useEffect } from "react";
import OrderingCard from "./OrderingCard"; // Component for individual food cards
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const userEmail = localStorage.getItem("userEmail");
  const firstLetter = userEmail ? userEmail.charAt(0).toUpperCase() : "";
  const navigate = useNavigate();

  // Add to Cart
  const handleAddToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1; // If item exists, increase quantity
    } else {
      cart.push({ ...item, quantity: 1 }); // If item doesn't exist, add new item with quantity 1
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart to localStorage
    alert(`${item.name} added to cart!`);
  };

  // Fetch Featured Items and Food Items
  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/food-items");
        const data = await response.json();
        setFeaturedItems(data);
      } catch (error) {
        console.error("Error fetching featured items:", error);
      }
    };

    const fetchFoodItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/food-items");
        const data = await response.json();
        setFoodItems(data); // Save fetched food items to state
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
    };

    fetchFeaturedItems();
    fetchFoodItems();
  }, []);

  // Carousel Auto-Rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === featuredItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [featuredItems.length]);

  // Carousel Navigation Handlers
  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === featuredItems.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? featuredItems.length - 1 : prev - 1
    );
  };

  // Profile Dropdown Handlers
  const handleMouseEnter = () => setIsDropdownVisible(true);
  const handleMouseLeave = () => setIsDropdownVisible(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    window.location.href = "/login";
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

  return (
    <div className="home-page">
      {/* Header Section */}
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

      {/* Carousel Section */}
      <section className="food-carousel">
        <div className="carousel-container">
          <button className="carousel-button prev" onClick={handlePrev}>
            ❮
          </button>
          {featuredItems.length > 0 && (
            <div className="food-card">
              <div className="food-card-content">
                <div className="food-images">
                  <div
                    className="background-image"
                    style={{
                      backgroundImage: `url(${featuredItems[currentIndex].image_url})`,
                    }}
                  />
                  <div className="main-content">
                    <img
                      src={featuredItems[currentIndex].image_url}
                      alt={featuredItems[currentIndex].title}
                      className="main-image"
                    />
                    <div className="small-images">
                      <img
                        src="/images/chef.jpg"
                        alt="Chef"
                        className="small-image"
                      />
                      <img
                        src="/images/ingredients.jpg"
                        alt="Ingredients"
                        className="small-image"
                      />
                    </div>
                  </div>
                </div>
                <div className="food-text">
                  <h2>{featuredItems[currentIndex].title}</h2>
                  <p>{featuredItems[currentIndex].description}</p>
                  <button
                    className="order-now"
                    onClick={() => handleAddToCart(featuredItems[currentIndex])}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          )}
          <button className="carousel-button next" onClick={handleNext}>
            ❯
          </button>
        </div>
      </section>

      {/* Food Section */}
      <section className="food-section">
        <h2 className="section-title">Best Recipes</h2>
        <div className="categories">
          <span>All</span>
          <span>Indian</span>
          <span>Punjabi</span>
          <span>Mexican</span>
          <span>Chinese</span>
          <span>Italian</span>
        </div>
        <div className="food-card-grid">
          {foodItems.length > 0 ? (
            foodItems.map((item, index) => (
              <OrderingCard
                key={index}
                image={item.image_url}
                title={item.name}
                price={item.price}
                onOrderNow={() => handleAddToCart(item)}
              />
            ))
          ) : (
            <p>Loading food items...</p>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <p>© RecipeShare All Rights Reserved</p>
        <p>🍴 YOO!!!</p>
        <p>
          Disclaimer: This site is only for ordering and learning to cook food.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;

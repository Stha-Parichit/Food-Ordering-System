import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Header Section */}
      <header className="landing-header">
        <div className="logo">
          <img src="/images/logo.png" alt="Logo" />
          <span>YOO!!!</span>
        </div>
        <nav className="nav-links">
          <a href="/home">Home</a>
          <a href="/categories">Categories</a>
          <div className="search-bar">
            <input type="text" placeholder="Search" />
            <button>🔍</button>
          </div>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </nav>
      </header>

      {/* Main Section */}
      <main className="main-content">
        <section className="intro">
          <h1>Share your recipes</h1>
          <h2>
            <span>Find new recipes</span> <br />
            Fulfill your hobbies
          </h2>
          <img
            src="images/cokking.png"
            alt="Chef Illustration" 
          />
        </section>

        <section className="recipes">
          <div className="recipe-card">
            <img src="https://via.placeholder.com/150" alt="Recipe" />
            <button>Add to cart</button>
          </div>
          <div className="recipe-card">
            <img src="https://via.placeholder.com/150" alt="Recipe" />
            <button>Add to cart</button>
          </div>
          <div className="recipe-card">
            <img src="https://via.placeholder.com/150" alt="Recipe" />
            <button>Add to cart</button>
          </div>
        </section>

        <div className="see-more">
          <button>See more ➡</button>
        </div>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <p>Copyright © YOO!!! All Rights Reserved</p>
        <div className="footer-links">
          <a href="/">Contact</a>
          <a href="/">Blog</a>
        </div>
        <p>
          Disclaimer: This site is only for ordering and learning to cook food.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;

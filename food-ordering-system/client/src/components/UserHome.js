import React from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./UserHome.css";
import { FaSearch, FaBell, FaUser } from "react-icons/fa";

const UserHome = () => {
    const navigate = useNavigate();
    const handleCategoryAll = () => {
        navigate("/categories");
    };
    useEffect(() => {
        document.title = "User Home";
        const link = document.querySelector("link[rel*='icon']");
        link.href = "./images/logo.png";
    }, []);
    return (
        <div className="user-home">
            <header className="home-header">
                <div className="logo">
                    <img src="/images/logo.png" alt="Logo" />
                    <span>YOO!!!</span>
                </div>
                <nav className="home-nav-links">
                    <a href="/home">Home</a>
                    <a href="/categories">Categories</a>
                    <a href="/dashboard">Dashboard</a>
                    </nav>
                <div className="home-search-bar">
                    <input type="text" placeholder="Search" />
                    <button> <FaSearch className="search-button"/></button>
                </div>
            </header>
            {/* <div className="home-carasol">
                <div className="carasol-text">
                    <h1>Food Name</h1>
                    <span>hgcghvmn  gh hg h hbhvjgchcgvhj   ghvtgcv bn ggvyvhgchg  gv gchg b bn gvhghg nb nv hg hg</span>
                    <img src="./images/pizza.png" alt="Pizza" />
                </div>
                <div className="carasol-">
                    
                </div>
            </div> */}
            <div className="home-categories">
                <button onClick={handleCategoryAll}>All</button>
                <button href="#">Indian</button>
                <button href="#">Chinease</button>
                <button href="#">Korean</button>
                <button href="#">Mexican</button>
            </div>
            <footer className="user-footer">
                <div className="footer-logo">
                    <img src="/images/logo.png" alt="Logo" />
                </div>
                <div className="footer-links">
                    <a href="/home">Contact</a>
                    <a href="/categories">Blog</a>
                </div>
                <div className="disclaimer">
                    <span>© 2021 YOO!!! All Rights Reserved.</span>
                </div>
            </footer>
        </div>
    );
};

export default UserHome;
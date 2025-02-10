import React from "react";
import "./UserManagement.css";
import { FaSearch, FaBell, FaUser } from "react-icons/fa";

const users = [
  { name: "Satkar Shrestha", role: "Users" },
  { name: "Sanju Shrestha", role: "Chef" },
  { name: "Biplab Shah", role: "Chef" },
  { name: "John Doe", role: "Users" },
  { name: "Alexa Alo", role: "Chef" },
  { name: "Sho Sho", role: "Users" },
];

const UserManagement = () => {
  return (
    <div className="user-management">
      <header className="header">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search" className="search-bar" />
        </div>
        <div className="icons">
          <FaBell className="icon" />
          <FaUser className="icon" />
        </div>
      </header>

      <div className="content">
        <div className="sidebar">
            <ul>
            <li>Reg. User</li>
            <li>Listed Items</li>
            <li>Blocked User</li>
          </ul>
        </div>

        <div className="user-list">
          <h2>All Users</h2>
          {users.map((user, index) => (
            <div key={index} className="user-item">
              <FaUser className="user-icon" />
              <span className="user-name">{user.name}</span>
              <span className={`role ${user.role.toLowerCase()}`}>{user.role}</span>
              <button className="edit-button">Edit</button>
              <button className="delete-button">Delete</button>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">
        <p>Copyright &copy; 2025. All Rights Reserved.</p>
        <p className="brand">📜 YOO!!!</p>
        <p className="disclaimer">Disclaimer: This site is only for ordering and learning to cook food.</p>
      </footer>
    </div>
  );
};

export default UserManagement;
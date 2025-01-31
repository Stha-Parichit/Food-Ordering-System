import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h3>Admin Panel</h3>
      <ul>
        <li>Reg. User</li>
        <li className="active">Listed Items</li>
        <li>Blocked User</li>
        <li>Reg. Chefs</li>
      </ul>
    </div>
  );
};

export default Sidebar;

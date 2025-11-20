import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiDroplet, 
  FiUsers, 
  FiActivity, 
  FiMenu, 
  FiX,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/milk-yard', icon: FiDroplet, label: 'Milk Yard' },
    { path: '/cattle', icon: FiUsers, label: 'Cattle' },
    { path: '/health', icon: FiActivity, label: 'Health Monitoring' },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        {isOpen && <h2 className="sidebar-title">Cattle Monitor</h2>}
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={!isOpen ? item.label : ''}
            >
              <Icon className="nav-icon" />
              {isOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      
      {isOpen && (
        <div className="sidebar-footer">
          <p className="footer-text">AI Cattle Monitoring</p>
          <p className="footer-version">v1.0.0</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;


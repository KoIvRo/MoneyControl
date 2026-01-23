import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Главная', icon: 'fas fa-home' },
    { path: '/analytics', label: 'Аналитика', icon: 'fas fa-chart-pie' },
    { path: '/transactions', label: 'Операции', icon: 'fas fa-exchange-alt' },
    { path: '/settings', label: 'Настройки', icon: 'fas fa-cog' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="desktop-layout">
      <div className="desktop-sidebar">
        <div className="desktop-header">
          <div className="header-logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.77.85-1.26 1.85-1.26.87 0 1.54.39 1.79 1.1.12.32.45.53.79.53h.97c.5 0 .84-.52.62-.96-.47-.95-1.43-1.7-2.92-1.97V7.5c0-.28-.22-.5-.5-.5h-1c-.28 0-.5.22-.5.5v1.1c-1.7.39-2.9 1.84-2.9 3.4 0 2.2 1.8 3.07 3.9 3.59 1.97.48 2.34 1.22 2.34 1.89 0 .61-.41 1.38-1.85 1.38-1.46 0-2.09-.65-2.32-1.32-.11-.32-.43-.53-.77-.53h-.95c-.5 0-.84.52-.62.97.57 1.29 1.78 1.92 3.58 2.13v1.27c0 .28.22.5.5.5h1c.28 0 .5-.22.5-.5v-1.27c1.97-.35 3.25-1.84 3.25-3.58-.01-2.08-1.65-2.94-3.89-3.48z"></path>
              </svg>
            </div>
            <div className="logo-text">MoneyControl</div>
          </div>
          
          <div className="user-info">
            <div className="user-greeting">
              <h1>Добро пожаловать, {user?.name || 'Пользователь'}!</h1>
              <p>{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="desktop-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`desktop-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </Link>
          ))}
          
          <button
            onClick={handleLogout}
            className="desktop-nav-item logout-button"
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Выход</span>
          </button>
        </nav>
      </div>

      <div className="desktop-content">
        <div className="desktop-card">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
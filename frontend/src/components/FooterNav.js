import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const FooterNav = ({ activePage }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { path: '/', label: 'Главная', icon: 'fas fa-home' },
        { path: '/analytics', label: 'Аналитика', icon: 'fas fa-chart-pie' },
        { path: '/transactions', label: 'Операции', icon: 'fas fa-exchange-alt' },
        { path: '/settings', label: 'Настройки', icon: 'fas fa-cog' },
    ];

    return (
        <div className="footer-nav">
        {navItems.map((item) => (
            <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
            >
            <i className={`nav-icon ${item.icon}`}></i>
            <span>{item.label}</span>
            </Link>
        ))}
        </div>
    );
};

export default FooterNav;
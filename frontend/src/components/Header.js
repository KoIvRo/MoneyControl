import React from 'react';

const Header = ({ title, subtitle, showBalance = true, showAvatar = true }) => {
    return (
        <div className="header">
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
                    <h1>{title}</h1>
                    <p>{subtitle}</p>
                </div>
                {showAvatar && (
                    <div className="user-avatar">
                        <i className="fas fa-user"></i>
                    </div>
                )}
            </div>
            
            {showBalance && (
                <div className="balance-card">
                    <div className="balance-title">Общий баланс</div>
                    <div className="balance-amount">125,430 ₽</div>
                    <div className="balance-stats">
                        <div className="stat-item">
                            <div className="stat-value income">+42,100 ₽</div>
                            <div className="stat-label">Доходы</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value expense">-18,670 ₽</div>
                            <div className="stat-label">Расходы</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FooterNav from '../components/FooterNav';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [notification, setNotification] = useState(null);
  
  useEffect(() => {
    if (user) {
      setNewName(user.name || '');
      setNewEmail(user.email || '');
    }
  }, [user]);
  
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  const isMobile = window.innerWidth < 768;

  const handleNameSave = () => {
    showNotification('Изменение имени будет доступно в следующей версии приложения', 'warning');
    setEditingName(false);
  };

  const handleEmailSave = () => {
    showNotification('Изменение email будет доступно в следующей версии приложения', 'warning');
    setEditingEmail(false);
  };

  const handleExportData = () => {
    const data = {
      user,
      exportDate: new Date().toISOString()
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `moneycontrol_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const settingsItems = [
    {
      icon: 'fas fa-user-edit',
      title: 'Редактировать профиль',
      description: 'Изменить личные данные',
      action: () => showNotification('Редактирование профиля будет доступно в следующей версии', 'warning')
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Безопасность',
      description: 'Смена пароля и двухфакторная аутентификация',
      action: () => showNotification('Настройки безопасности будет доступна в следующей версии', 'warning')
    },
    {
      icon: 'fas fa-bell',
      title: 'Уведомления',
      description: 'Настройка оповещений',
      action: () => showNotification('Настройка уведомлений будет доступна в следующей версии', 'warning')
    },
    {
      icon: 'fas fa-palette',
      title: 'Внешний вид',
      description: 'Тема и настройки отображения',
      action: () => showNotification('Изменение темы будет доступено в следующей версии', 'warning')
    },
    {
      icon: 'fas fa-wallet',
      title: 'Счета и категории',
      description: 'Управление счетами и категориями расходов',
      action: () => showNotification('Управление счетами будет доступен в следующей версии', 'warning')
    },
    {
      icon: 'fas fa-file-export',
      title: 'Экспорт данных',
      description: 'Выгрузка финансовых данных',
      action: handleExportData
    },
    {
      icon: 'fas fa-question-circle',
      title: 'Помощь и поддержка',
      description: 'FAQ и контакты поддержки',
      action: () => showNotification('Раздел помощи будет доступен в следующей версии', 'warning')
    },
    {
      icon: 'fas fa-info-circle',
      title: 'О приложении',
      description: 'Версия 1.0.0',
      action: () => showNotification('MoneyControl v1.0.0\nФинансовый менеджер\n© 2026', 'info')
    }
  ];

  const renderNotification = () => {
    if (!notification) return null;
    
    const bgColor = notification.type === 'warning' ? '#ff9800' : 
                    notification.type === 'success' ? '#4caf50' : '#2196f3';
    
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: bgColor,
        color: 'white',
        padding: '15px 25px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        maxWidth: '90%',
        width: 'auto',
        textAlign: 'center',
        animation: 'fadeIn 0.3s ease-in'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          fontSize: '14px'
        }}>
          <i className={`fas fa-${
            notification.type === 'warning' ? 'exclamation-triangle' :
            notification.type === 'success' ? 'check-circle' : 'info-circle'
          }`}></i>
          <span>{notification.message}</span>
        </div>
      </div>
    );
  };

  const notificationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `;

  const renderMobileView = () => (
    <div className="page-container settings-page">
      <style>{notificationStyles}</style>
      {renderNotification()}
      
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
            <h1>Настройки</h1>
            <p>Управление профилем и приложением</p>
          </div>
        </div>
      </div>
      
      <div className="content">
        <div className="profile-section">
          <div className="profile-avatar" onClick={() => showNotification('Смена аватара доступна в полной версии', 'warning')}>
            <i className="fas fa-user"></i>
          </div>
          
          {editingName ? (
            <div style={{ width: '100%', maxWidth: '300px', marginBottom: '20px' }}>
              <input
                type="text"
                className="form-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{ textAlign: 'center', fontSize: '20px', fontWeight: '600' }}
                placeholder="Введите имя"
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  className="primary-button"
                  onClick={handleNameSave}
                  style={{ padding: '8px 16px' }}
                >
                  Сохранить
                </button>
                <button
                  className="secondary-button"
                  onClick={() => {
                    setEditingName(false);
                    setNewName(user?.name || '');
                  }}
                  style={{ padding: '8px 16px' }}
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-name" style={{ cursor: 'pointer' }} onClick={() => setEditingName(true)}>
              {user?.name || 'Без имени'}
              <i className="fas fa-edit" style={{ marginLeft: '10px', fontSize: '14px', opacity: 0.5 }}></i>
            </div>
          )}
          
          {editingEmail ? (
            <div style={{ width: '100%', maxWidth: '300px', marginTop: '10px' }}>
              <input
                type="email"
                className="form-input"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                style={{ textAlign: 'center', fontSize: '14px' }}
                placeholder="Введите email"
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  className="primary-button"
                  onClick={handleEmailSave}
                  style={{ padding: '8px 16px' }}
                >
                  Сохранить
                </button>
                <button
                  className="secondary-button"
                  onClick={() => {
                    setEditingEmail(false);
                    setNewEmail(user?.email || '');
                  }}
                  style={{ padding: '8px 16px' }}
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-email" style={{ cursor: 'pointer' }} onClick={() => setEditingEmail(true)}>
              {user?.email || 'Без email'}
              <i className="fas fa-edit" style={{ marginLeft: '10px', fontSize: '12px', opacity: 0.5 }}></i>
            </div>
          )}
        </div>
        
        <div className="settings-list">
          {settingsItems.map((item, index) => (
            <div className="settings-item" key={index} onClick={item.action}>
              <div className="settings-icon">
                <i className={item.icon}></i>
              </div>
              <div className="settings-details">
                <div className="settings-title">{item.title}</div>
                <div className="settings-description">{item.description}</div>
              </div>
              <div className="settings-arrow">
                <i className="fas fa-chevron-right"></i>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '40px', marginBottom: '20px' }}>
          <button
            className="secondary-button"
            onClick={logout}
            style={{
              borderColor: '#ea4335',
              color: '#ea4335',
              padding: '15px'
            }}
          >
            <i className="fas fa-sign-out-alt"></i> Выйти из аккаунта
          </button>
        </div>
        
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px', marginTop: '20px' }}>
          MoneyControl v1.0.0
        </div>
      </div>
      
      <FooterNav activePage="settings" />
    </div>
  );

  const renderDesktopView = () => (
    <div className="desktop-card-content">
      <style>{notificationStyles}</style>
      {renderNotification()}
      
      <div className="section">
        <div className="section-title">
          <h2>Настройки профиля</h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px' }}>
          <div className="profile-avatar" style={{ width: '120px', height: '120px' }} onClick={() => showNotification('Смена аватара доступна в полной версии', 'warning')}>
            <i className="fas fa-user"></i>
          </div>
          
          <div style={{ flex: 1 }}>
            {editingName ? (
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">Имя</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Введите имя"
                  />
                  <button
                    className="primary-button"
                    onClick={handleNameSave}
                    style={{ width: 'auto', padding: '0 20px' }}
                  >
                    Сохранить
                  </button>
                  <button
                    className="secondary-button"
                    onClick={() => {
                      setEditingName(false);
                      setNewName(user?.name || '');
                    }}
                    style={{ width: 'auto', padding: '0 20px' }}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '20px' }}>
                <div className="form-label">Имя</div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'white'
                }}>
                  <div style={{ fontSize: '16px' }}>{user?.name || 'Без имени'}</div>
                  <button
                    onClick={() => setEditingName(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
              </div>
            )}
            
            {editingEmail ? (
              <div>
                <label className="form-label">Email</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="email"
                    className="form-input"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Введите email"
                  />
                  <button
                    className="primary-button"
                    onClick={handleEmailSave}
                    style={{ width: 'auto', padding: '0 20px' }}
                  >
                    Сохранить
                  </button>
                  <button
                    className="secondary-button"
                    onClick={() => {
                      setEditingEmail(false);
                      setNewEmail(user?.email || '');
                    }}
                    style={{ width: 'auto', padding: '0 20px' }}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="form-label">Email</div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'white'
                }}>
                  <div style={{ fontSize: '16px' }}>{user?.email || 'Без email'}</div>
                  <button
                    onClick={() => setEditingEmail(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        {settingsItems.map((item, index) => (
          <div 
            key={index} 
            className="settings-item" 
            onClick={item.action}
            style={{ marginBottom: 0 }}
          >
            <div className="settings-icon">
              <i className={item.icon}></i>
            </div>
            <div className="settings-details">
              <div className="settings-title">{item.title}</div>
              <div className="settings-description">{item.description}</div>
            </div>
            <div className="settings-arrow">
              <i className="fas fa-chevron-right"></i>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <button
          className="secondary-button"
          onClick={logout}
          style={{
            borderColor: '#ea4335',
            color: '#ea4335',
            padding: '15px 40px',
            maxWidth: '300px',
            margin: '0 auto'
          }}
        >
          <i className="fas fa-sign-out-alt"></i> Выйти из аккаунта
        </button>
        
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px', marginTop: '20px' }}>
          MoneyControl v1.0.0
        </div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#007bff', marginBottom: '20px' }}></i>
        <div>Загрузка профиля...</div>
      </div>
    );
  }

  return isMobile ? renderMobileView() : renderDesktopView();
};

export default SettingsPage;
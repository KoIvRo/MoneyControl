import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FooterNav from '../components/FooterNav';
import CategoryItem from '../components/CategoryItem';
import TransactionItem from '../components/TransactionItem';
import AddTransactionModal from '../components/AddTransactionModal';
import BalanceCard from '../components/BalanceCard';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, transactions = [], categories = [] } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [transactionType, setTransactionType] = useState('expense');
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0 });
  
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (Array.isArray(transactions)) {
      const sorted = [...transactions]
        .sort((a, b) => {
          try {
            const dateA = a?.date ? new Date(a.date).getTime() : 0;
            const dateB = b?.date ? new Date(b.date).getTime() : 0;
            return dateB - dateA;
          } catch {
            return 0;
          }
        })
        .slice(0, 5)
        .filter(t => t && t.id);
      
      setRecentTransactions(sorted);
      
      const totalIncome = transactions
        .filter(t => t && t.type === 'income')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
      
      const totalExpense = transactions
        .filter(t => t && t.type === 'expense')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
      
      setStats({ totalIncome, totalExpense });
    } else {
      setRecentTransactions([]);
      setStats({ totalIncome: 0, totalExpense: 0 });
    }
  }, [transactions]);

  const expenseCategories = Array.isArray(categories) 
    ? categories.filter(cat => cat && cat.type === 'expense')
    : [];

  const handleCategoryClick = (category) => {
    if (category && category.id) {
      setSelectedCategory(category);
      setTransactionType('expense');
      setIsModalOpen(true);
    }
  };

  const handleAddIncome = () => {
    setSelectedCategory(null);
    setTransactionType('income');
    setIsModalOpen(true);
  };

  const handleAddExpense = () => {
    setSelectedCategory(null);
    setTransactionType('expense');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setTransactionType('expense');
  };

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#007bff' }}></i>
        <div>Загрузка данных...</div>
      </div>
    );
  }

  const renderMobileView = () => (
    <div className="page-container">
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
            <h1>Добро пожаловать, {user?.name || 'Пользователь'}!</h1>
            <p>Ваши финансы под контролем</p>
          </div>
          <div className="user-avatar">
            <i className="fas fa-user"></i>
          </div>
        </div>
      </div>
      
      <div className="content">
        <div className="section">
          <div className="section-title">
            <h2>Финансовый обзор</h2>
          </div>
          <BalanceCard />
          
          <div className="balance-stats" style={{ marginTop: '20px' }}>
            <div className="stat-item">
              <div className="stat-value income">+{stats.totalIncome.toLocaleString('ru-RU')} ₽</div>
              <div className="stat-label">Всего доходов</div>
            </div>
            <div className="stat-item">
              <div className="stat-value expense">-{stats.totalExpense.toLocaleString('ru-RU')} ₽</div>
              <div className="stat-label">Всего расходов</div>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            marginTop: '20px',
            flexDirection: 'column'
          }}>
            <button 
              onClick={handleAddIncome}
              style={{
                padding: '14px',
                background: 'linear-gradient(135deg, #34a853, #2e8b47)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(52, 168, 83, 0.3)'
              }}
            >
              <i className="fas fa-plus-circle"></i>
              Добавить доход
            </button>
            
            <button 
              onClick={handleAddExpense}
              style={{
                padding: '14px',
                background: 'linear-gradient(135deg, #ea4335, #d32f2f)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(234, 67, 53, 0.3)'
              }}
            >
              <i className="fas fa-minus-circle"></i>
              Добавить расход
            </button>
          </div>
        </div>
        
        {expenseCategories.length > 0 && (
          <div className="section">
            <div className="section-title">
              <h2>Быстрая запись расходов</h2>
            </div>
            <div className="categories">
              {expenseCategories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  onClick={handleCategoryClick}
                />
              ))}
            </div>
          </div>
        )}
        
        <div className="section">
          <div className="section-title">
            <h2>Последние операции</h2>
          </div>
          <div className="transactions">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id || `transaction-${Math.random()}`}
                  transaction={transaction}
                />
              ))
            ) : (
              <div className="text-center" style={{ 
                color: 'var(--text-secondary)', 
                padding: '40px 20px',
                border: '1px dashed var(--border)',
                borderRadius: '12px',
                margin: '10px 0'
              }}>
                <i className="fas fa-receipt" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}></i>
                <div style={{ fontSize: '16px', marginBottom: '8px' }}>Операций пока нет</div>
                <div style={{ fontSize: '14px', marginBottom: '20px' }}>Добавьте свою первую операцию</div>
                <button 
                  className="primary-button"
                  onClick={handleAddIncome}
                  style={{ maxWidth: '200px', margin: '0 auto', padding: '10px 20px' }}
                >
                  <i className="fas fa-plus"></i> Добавить операцию
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <button className="add-transaction-btn" onClick={handleAddExpense}>
        <i className="fas fa-plus"></i>
      </button>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialCategory={selectedCategory}
        initialType={transactionType}
      />

      <FooterNav activePage="home" />
    </div>
  );

  const renderDesktopView = () => (
    <div className="desktop-card-content">
      <div className="section">
        <div className="section-title">
          <h2>Финансовый обзор</h2>
        </div>
        <BalanceCard />
        
        <div className="balance-stats" style={{ marginTop: '10px' }}>
          <div className="stat-item">
            <div className="stat-value income" style={{ fontSize: '28px', fontWeight: '700' }}>
              +{stats.totalIncome.toLocaleString('ru-RU')} ₽
            </div>
            <div className="stat-label" style={{ fontSize: '18px', fontWeight: '500', marginTop: '1px' }}>
              Всего доходов
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-value expense" style={{ fontSize: '28px', fontWeight: '700' }}>
              -{stats.totalExpense.toLocaleString('ru-RU')} ₽
            </div>
            <div className="stat-label" style={{ fontSize: '18px', fontWeight: '500', marginTop: '1px' }}>
              Всего расходов
            </div>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginTop: '25px',
          marginBottom: '30px'
        }}>
          <button 
            onClick={handleAddIncome}
            style={{
              flex: 1,
              padding: '16px',
              background: 'linear-gradient(135deg, #34a853, #2e8b47)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 12px rgba(52, 168, 83, 0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(52, 168, 83, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(52, 168, 83, 0.3)';
            }}
          >
            <i className="fas fa-plus-circle" style={{ fontSize: '18px' }}></i>
            Добавить доход
          </button>
          
          <button 
            onClick={handleAddExpense}
            style={{
              flex: 1,
              padding: '16px',
              background: 'linear-gradient(135deg, #ea4335, #d32f2f)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 12px rgba(234, 67, 53, 0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(234, 67, 53, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(234, 67, 53, 0.3)';
            }}
          >
            <i className="fas fa-minus-circle" style={{ fontSize: '18px' }}></i>
            Добавить расход
          </button>
        </div>
      </div>
      
      {expenseCategories.length > 0 && (
        <div className="section">
          <div className="section-title">
            <h2>Быстрая запись расходов</h2>
          </div>
          <div className="categories">
            {expenseCategories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="section">
        <div className="section-title">
          <h2>Последние операции</h2>
        </div>
        <div className="transactions">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id || `transaction-${Math.random()}`}
                transaction={transaction}
              />
            ))
          ) : (
            <div className="text-center" style={{ 
              color: 'var(--text-secondary)', 
              padding: '60px 20px',
              border: '1px dashed var(--border)',
              borderRadius: '12px',
              margin: '10px 0'
            }}>
              <i className="fas fa-receipt" style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.5 }}></i>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>Операций пока нет</div>
              <div style={{ fontSize: '14px', marginBottom: '30px' }}>Добавьте свою первую операцию</div>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <button 
                  className="primary-button"
                  onClick={handleAddIncome}
                  style={{ padding: '12px 24px' }}
                >
                  <i className="fas fa-plus"></i> Добавить доход
                </button>
                <button 
                  className="secondary-button"
                  onClick={handleAddExpense}
                  style={{ padding: '12px 24px' }}
                >
                  <i className="fas fa-minus"></i> Добавить расход
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialCategory={selectedCategory}
        initialType={transactionType}
      />
    </div>
  );

  return isMobile ? renderMobileView() : renderDesktopView();
};

export default HomePage;
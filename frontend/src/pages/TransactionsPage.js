import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FooterNav from '../components/FooterNav';
import TransactionItem from '../components/TransactionItem';
import AddTransactionModal from '../components/AddTransactionModal';

const TransactionsPage = () => {
  const { transactions } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });
  
  const isMobile = window.innerWidth < 768;

  const categories = [...new Set(transactions.map(t => t.category))].sort();

  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    transactions.forEach(t => {
      const year = new Date(t.date).getFullYear();
      if (!years.includes(year)) {
        years.push(year);
      }
    });
    if (!years.includes(currentYear)) {
      years.push(currentYear);
    }
    return years.sort((a, b) => b - a);
  };

  useEffect(() => {
    let filtered = Array.isArray(transactions) ? [...transactions] : [];

    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t && t.type === filters.type);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(t => t && t.category === filters.category);
    }

    filtered = filtered.filter(t => {
      if (!t || !t.date) return false;
      
      try {
        const date = new Date(t.date);
        return date.getMonth() === filters.month && date.getFullYear() === filters.year;
      } catch (error) {
        return false;
      }
    });

    filtered.sort((a, b) => {
      const dateA = a?.date ? new Date(a.date).getTime() : 0;
      const dateB = b?.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

    setFilteredTransactions(filtered);
  }, [transactions, filters]);

  const totalAmount = filteredTransactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount;
  }, 0);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    });
  };

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
            <h1>История операций</h1>
            <p>Все ваши транзакции</p>
          </div>
        </div>
      </div>
      
      <div className="content">
        <div className="section">
          <div className="section-title">
            <h2>Фильтры</h2>
            <button 
              onClick={clearFilters}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Сбросить
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            {['all', 'income', 'expense'].map((type) => (
              <button
                key={type}
                onClick={() => handleFilterChange('type', type)}
                style={{
                  padding: '8px 16px',
                  border: `1px solid ${filters.type === type ? 'var(--primary)' : 'var(--border)'}`,
                  background: filters.type === type ? 'var(--primary)' : 'white',
                  color: filters.type === type ? 'white' : 'var(--text-primary)',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                {type === 'all' ? 'Все' : type === 'income' ? 'Доходы' : 'Расходы'}
              </button>
            ))}
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <select 
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="form-select"
            >
              <option value="all">Все категории</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <select 
              value={filters.month}
              onChange={(e) => handleFilterChange('month', parseInt(e.target.value))}
              className="form-select"
              style={{ flex: 1 }}
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
            <select 
              value={filters.year}
              onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
              className="form-select"
              style={{ flex: 1 }}
            >
              {generateYears().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          color: 'white',
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '5px' }}>
            Итог за {months[filters.month]} {filters.year} года
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {totalAmount >= 0 ? '+' : ''}{totalAmount.toLocaleString()} ₽
          </div>
        </div>
        
        <div className="section">
          <div className="section-title">
            <h2>Операции ({filteredTransactions.length})</h2>
          </div>
          
          {filteredTransactions.length > 0 ? (
            <div className="transactions">
              {filteredTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </div>
          ) : (
            <div style={{ 
              padding: '40px 20px',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              border: '1px dashed var(--border)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>
                <i className="fas fa-receipt"></i>
              </div>
              <div style={{ fontSize: '16px', marginBottom: '10px' }}>
                Операции не найдены
              </div>
              <div style={{ fontSize: '14px', marginBottom: '20px' }}>
                Попробуйте изменить фильтры или добавьте новую операцию
              </div>
              <button 
                className="primary-button"
                onClick={() => setIsModalOpen(true)}
                style={{ maxWidth: '200px', margin: '0 auto' }}
              >
                <i className="fas fa-plus"></i> Добавить операцию
              </button>
            </div>
          )}
        </div>
      </div>
      
      <button className="add-transaction-btn" onClick={() => setIsModalOpen(true)}>
        <i className="fas fa-plus"></i>
      </button>
      
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      
      <FooterNav activePage="transactions" />
    </div>
  );

  const renderDesktopView = () => (
  <div className="desktop-card-content" style={{ 
    minHeight: 'calc(100vh - 160px)',
    paddingBottom: '40px'
  }}>
    <div className="section">
      <div className="section-title">
        <h2>История операций</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            {months[filters.month]} {filters.year}: {totalAmount >= 0 ? '+' : ''}{totalAmount.toLocaleString()} ₽
          </div>
          <button 
            className="primary-button"
            onClick={() => setIsModalOpen(true)}
            style={{ padding: '10px 20px', fontSize: '14px' }}
          >
            <i className="fas fa-plus"></i> Новая операция
          </button>
        </div>
      </div>
    </div>
    
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(4, 1fr)', 
      gap: '15px',
      marginBottom: '30px',
      position: 'relative', 
      zIndex: 2 
    }}>
      <div>
        <label className="form-label">Тип операции</label>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['all', 'income', 'expense'].map((type) => (
            <button
              key={type}
              onClick={() => handleFilterChange('type', type)}
              style={{
                padding: '8px 12px',
                border: `1px solid ${filters.type === type ? 'var(--primary)' : 'var(--border)'}`,
                background: filters.type === type ? 'var(--primary)' : 'white',
                color: filters.type === type ? 'white' : 'var(--text-primary)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                flex: 1
              }}
            >
              {type === 'all' ? 'Все' : type === 'income' ? 'Доходы' : 'Расходы'}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="form-label">Категория</label>
        <select 
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="form-select"
        >
          <option value="all">Все категории</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="form-label">Месяц</label>
        <select 
          value={filters.month}
          onChange={(e) => handleFilterChange('month', parseInt(e.target.value))}
          className="form-select"
        >
          {months.map((month, index) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="form-label">Год</label>
        <select 
          value={filters.year}
          onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
          className="form-select"
        >
          {generateYears().map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
    </div>
    
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(3, 1fr)', 
      gap: '20px',
      marginBottom: '20px',
      position: 'relative', 
      zIndex: 2 
    }}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        border: '1px solid var(--border)'
      }}>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Количество операций
        </div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#000000' }}>
          {filteredTransactions.length}
        </div>
      </div>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        border: '1px solid var(--border)'
      }}>
        <div style={{ fontSize: '14px', marginBottom: '8px', color: '#000000' }}>Сумма доходов</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#000000' }}>
          +{filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toLocaleString()} ₽
        </div>
      </div>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        border: '1px solid var(--border)'
      }}>
        <div style={{ fontSize: '14px', marginBottom: '8px', color: '#000000' }}>Сумма расходов</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#000000' }}>
          -{filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toLocaleString()} ₽
        </div>
      </div>
    </div>
    
    <div style={{ 
      maxHeight: '300px', 
      overflowY: 'auto',
      borderRadius: '12px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      background: 'white',
      border: '1px solid var(--border)',
      paddingTop: '20px', 
      marginTop: '-10px', 
      position: 'relative',
      zIndex: 1 
    }}>
      {filteredTransactions.length > 0 ? (
        <div className="transactions" style={{ padding: '0 20px' }}>
          {filteredTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
            />
          ))}
        </div>
      ) : (
        <div style={{ 
          padding: '60px 20px',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          border: '1px dashed var(--border)',
          borderRadius: '12px',
          margin: '20px',
          background: 'white'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.5 }}>
            <i className="fas fa-receipt"></i>
          </div>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>
            Операции не найдены
          </div>
          <div style={{ fontSize: '14px', marginBottom: '30px' }}>
            Попробуйте изменить фильтры или добавьте новую операцию
          </div>
          <button 
            className="primary-button"
            onClick={() => setIsModalOpen(true)}
            style={{ maxWidth: '200px', margin: '0 auto' }}
          >
            <i className="fas fa-plus"></i> Добавить первую операцию
          </button>
        </div>
      )}
    </div>
    
    <AddTransactionModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
  </div>
);

  return isMobile ? renderMobileView() : renderDesktopView();
};

export default TransactionsPage;
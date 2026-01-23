import React from 'react';
import { useAuth } from '../context/AuthContext';

const BalanceCard = () => {
  const { accounts } = useAuth();

  const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0);

  return (
    <div className="balance-card">
      <div className="balance-title">Общий баланс</div>
      
      <div className="balance-amount">
        {totalBalance.toLocaleString('ru-RU')} ₽
      </div>
      
      <div className="balance-stats" style={{ marginTop: '10px' }}>
        <div className="stat-item">
          <div className="stat-value">
            {accounts.length > 0 ? accounts[0].name : 'Основной счет'}
          </div>
          <div className="stat-label">Счет</div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
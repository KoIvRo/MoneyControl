import React from 'react';

const TransactionItem = ({ transaction }) => {
    if (!transaction) return null;

    const formatDate = (dateString) => {
        try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        } catch (error) {
        return 'Некорректная дата';
        }
    };

    const getCategoryIcon = (category) => {
        const iconMap = {
        'Еда': 'fas fa-utensils',
        'Транспорт': 'fas fa-car',
        'Покупки': 'fas fa-shopping-bag',
        'Жилье': 'fas fa-home',
        'Развлечения': 'fas fa-film',
        'Здоровье': 'fas fa-heartbeat',
        'Образование': 'fas fa-graduation-cap',
        'Другое': 'fas fa-ellipsis-h',
        'Зарплата': 'fas fa-money-check-alt',
        'Фриланс': 'fas fa-laptop-code',
        'Инвестиции': 'fas fa-chart-line',
        'Подарок': 'fas fa-gift',
        'Возврат': 'fas fa-redo',
        'Salary': 'fas fa-money-check-alt',
        'Food': 'fas fa-utensils',
        'Transport': 'fas fa-car',
        'Shopping': 'fas fa-shopping-bag',
        'Entertainment': 'fas fa-film',
        'Health': 'fas fa-heartbeat',
        'Education': 'fas fa-graduation-cap'
        };
        
        return iconMap[category] || 'fas fa-tag';
    };

    const getCategoryColor = (category, type) => {
        if (type === 'income') return '#34a853';
        if (type === 'expense') return '#ea4335';
        
        const colorMap = {
        'Еда': '#fb8c00',
        'Транспорт': '#4285f4',
        'Покупки': '#ea4335',
        'Жилье': '#34a853',
        'Развлечения': '#ab47bc',
        'Здоровье': '#42a5f5',
        'Образование': '#ff9800',
        'Другое': '#9e9e9e',
        'Зарплата': '#34a853',
        'Фриланс': '#4285f4',
        'Инвестиции': '#ff9800',
        'Подарок': '#ab47bc',
        'Возврат': '#42a5f5'
        };
        
        return colorMap[category] || '#1a73e8';
    };

    const isIncome = transaction.type === 'income';
    const amount = transaction.amount || 0;
    const category = transaction.category || 'Другое';
    const comment = transaction.comment || '';

    return (
        <div className="transaction-item">
        <div 
            className="transaction-icon"
            style={{ 
            backgroundColor: `${getCategoryColor(category, transaction.type)}15`,
            color: getCategoryColor(category, transaction.type)
            }}
        >
            <i className={getCategoryIcon(category)}></i>
        </div>
        
        <div className="transaction-details">
            <div className="transaction-title">
            {comment || category}
            </div>
            <div className="transaction-category">
            {category} • {formatDate(transaction.date)}
            </div>
        </div>
        
        <div className={`transaction-amount ${isIncome ? 'income' : 'expense'}`}>
            {isIncome ? '+' : '-'}{amount.toLocaleString('ru-RU')} ₽
        </div>
        </div>
    );
};

export default TransactionItem;
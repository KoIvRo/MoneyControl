import React from 'react';

const CategoryItem = ({ category, onClick }) => {
  if (!category) return null;

  const getCategoryIcon = (categoryName) => {
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
      'Возврат': 'fas fa-redo'
    };
    
    return iconMap[categoryName] || 'fas fa-tag';
  };

  const getCategoryColor = (categoryName) => {
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
    
    return colorMap[categoryName] || '#1a73e8';
  };

  return (
    <div className="category-item" onClick={() => onClick(category)}>
      <div 
        className="category-icon" 
        style={{ 
          backgroundColor: `${getCategoryColor(category.name)}15`,
          color: getCategoryColor(category.name)
        }}
      >
        <i className={getCategoryIcon(category.name)}></i>
      </div>
      <div className="category-name">{category.name}</div>
    </div>
  );
};

export default CategoryItem;
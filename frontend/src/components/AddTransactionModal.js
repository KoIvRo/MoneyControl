import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AddTransactionModal = ({ isOpen, onClose, initialCategory = null, initialType = 'expense' }) => {
  const { categories, accounts, addTransaction } = useAuth();
  const [formData, setFormData] = useState({
    type: initialType,
    category: initialCategory?.name || '',
    amount: '',
    comment: '',
    date: new Date().toISOString().slice(0, 16)
  });

  useEffect(() => {
    if (initialCategory) {
      setFormData(prev => ({
        ...prev,
        category: initialCategory.name,
        type: 'expense'
      }));
    }
  }, [initialCategory]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    try {
      const result = await addTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
        account_id: 1 
      });

      if (result.success) {
        onClose();
        setFormData({
          type: 'expense',
          category: '',
          amount: '',
          comment: '',
          date: new Date().toISOString().slice(0, 16)
        });
      } else {
        alert(result.error || 'Ошибка при добавлении транзакции');
      }
    } catch (error) {
      alert('Ошибка при добавлении транзакции');
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredCategories = categories.filter(
    cat => cat.type === formData.type || (formData.type === 'expense' && !cat.type)
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">
            {formData.type === 'income' ? 'Добавить доход' : 'Добавить расход'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: `2px solid ${formData.type === 'income' ? '#34a853' : '#ddd'}`,
                    background: formData.type === 'income' ? '#34a85315' : 'white',
                    color: formData.type === 'income' ? '#34a853' : '#666',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: formData.type === 'income' ? '600' : '400'
                  }}
                >
                  Доход
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: `2px solid ${formData.type === 'expense' ? '#ea4335' : '#ddd'}`,
                    background: formData.type === 'expense' ? '#ea433515' : 'white',
                    color: formData.type === 'expense' ? '#ea4335' : '#666',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: formData.type === 'expense' ? '600' : '400'
                  }}
                >
                  Расход
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Категория *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Выберите категорию</option>
                {filteredCategories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Сумма (₽) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="form-input"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Дата и время</label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Комментарий</label>
              <input
                type="text"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                className="form-input"
                placeholder="Необязательно"
              />
            </div>

            <div className="form-group" style={{ 
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#5f6368'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-info-circle" style={{ color: '#1a73e8' }}></i>
                <span>Транзакция будет добавлена на основной счет</span>
              </div>
              {accounts.length > 0 && (
                <div style={{ marginTop: '5px', fontWeight: '500' }}>
                  Баланс: {accounts[0]?.balance?.toLocaleString('ru-RU')} ₽
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="primary-button"
              style={{ flex: 1 }}
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
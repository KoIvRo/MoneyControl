import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    initialBalance: '0'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Введите ваше имя';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    if (formData.initialBalance) {
      const balance = parseFloat(formData.initialBalance);
      if (isNaN(balance)) {
        newErrors.initialBalance = 'Введите корректное число';
      } else if (balance < 0) {
        newErrors.initialBalance = 'Баланс не может быть отрицательным';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError('');
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const initialBalance = parseFloat(formData.initialBalance) || 0;
      
      const result = await register(
        formData.email, 
        formData.password, 
        formData.name,
        initialBalance
      );
      
      if (result.success) {
        navigate('/');
      } else {
        setApiError(result.error || 'Ошибка регистрации');
      }
    } catch (error) {
      setApiError(error.message || 'Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container register-page">
      <div className="login-logo">
        <div className="login-logo-icon">
          <svg viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.77.85-1.26 1.85-1.26.87 0 1.54.39 1.79 1.1.12.32.45.53.79.53h.97c.5 0 .84-.52.62-.96-.47-.95-1.43-1.7-2.92-1.97V7.5c0-.28-.22-.5-.5-.5h-1c-.28 0-.5.22-.5.5v1.1c-1.7.39-2.9 1.84-2.9 3.4 0 2.2 1.8 3.07 3.9 3.59 1.97.48 2.34 1.22 2.34 1.89 0 .61-.41 1.38-1.85 1.38-1.46 0-2.09-.65-2.32-1.32-.11-.32-.43-.53-.77-.53h-.95c-.5 0-.84.52-.62.97.57 1.29 1.78 1.92 3.58 2.13v1.27c0 .28.22.5.5.5h1c.28 0 .5-.22.5-.5v-1.27c1.97-.35 3.25-1.84 3.25-3.58-.01-2.08-1.65-2.94-3.89-3.48z"></path>
          </svg>
        </div>
        <div className="login-logo-text">MoneyControl</div>
      </div>
      
      <div className="login-form">
        <h2 className="text-center mb-20">Создание аккаунта</h2>
        
        {apiError && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
            {apiError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <InputField
            label="Ваше имя"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Иван Иванов"
            required
            error={errors.name}
            icon="fas fa-user"
            disabled={loading}
          />
          
          <InputField
            label="Электронная почта"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@mail.com"
            required
            error={errors.email}
            icon="fas fa-envelope"
            disabled={loading}
          />
          
          <InputField
            label="Начальный баланс (₽)"
            type="number"
            step="0.01"
            name="initialBalance"
            value={formData.initialBalance}
            onChange={handleChange}
            placeholder="0.00"
            error={errors.initialBalance}
            helperText="Можно оставить 0 и пополнить позже"
            icon="fas fa-wallet"
            disabled={loading}
          />
          
          <InputField
            label="Пароль"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Минимум 6 символов"
            required
            error={errors.password}
            icon="fas fa-lock"
            disabled={loading}
          />
          
          <InputField
            label="Подтверждение пароля"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Повторите пароль"
            required
            error={errors.confirmPassword}
            icon="fas fa-lock"
            disabled={loading}
          />
          
          <button 
            type="submit" 
            className="primary-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                Регистрация...
              </>
            ) : 'Зарегистрироваться'}
          </button>
        </form>
        
        <div className="form-links">
          <Link to="/login" className="form-link">Уже есть аккаунт? Войти</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
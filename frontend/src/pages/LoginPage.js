import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, error, loading, setError } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (!email || !password) {
            setError('Заполните все поля');
            return;
        }
        
        if (password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов');
            return;
        }
        
        setIsLoading(true);
        
        try {
            const result = await login(email, password);
            
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || 'Неверный email или пароль');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Произошла ошибка при входе');
        } finally {
            setIsLoading(false);
        }
    };

    const isLoggingIn = isLoading || loading;

    return (
        <div className="page-container login-page">
            <div className="login-logo">
                <div className="login-logo-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.77.85-1.26 1.85-1.26.87 0 1.54.39 1.79 1.1.12.32.45.53.79.53h.97c.5 0 .84-.52.62-.96-.47-.95-1.43-1.7-2.92-1.97V7.5c0-.28-.22-.5-.5-.5h-1c-.28 0-.5.22-.5.5v1.1c-1.7.39-2.9 1.84-2.9 3.4 0 2.2 1.8 3.07 3.9 3.59 1.97.48 2.34 1.22 2.34 1.89 0 .61-.41 1.38-1.85 1.38-1.46 0-2.09-.65-2.32-1.32-.11-.32-.43-.53-.77-.53h-.95c-.5 0-.84.52-.62.97.57 1.29 1.78 1.92 3.58 2.13v1.27c0 .28.22.5.5.5h1c.28 0 .5-.22.5-.5v-1.27c1.97-.35 3.25-1.84 3.25-3.58-.01-2.08-1.65-2.94-3.89-3.48z"></path>
                    </svg>
                </div>
                <div className="login-logo-text">MoneyControl</div>
            </div>
            
            <div className="login-form">
                <h2 className="text-center mb-20">Вход в систему</h2>
                
                {error && (
                    <div className="error-message">
                        <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-input"
                            placeholder="example@mail.com"
                            disabled={isLoggingIn}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-input"
                            placeholder="Введите пароль"
                            disabled={isLoggingIn}
                            minLength="6"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="primary-button"
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? (
                            <>
                                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                                Вход...
                            </>
                        ) : 'Войти'}
                    </button>
                </form>
                
                <div className="form-links">
                    <Link to="/register" className="form-link">
                        Нет аккаунта? Зарегистрироваться
                    </Link>
                </div>
                
                <div className="demo-info">
                    <p><strong>Для тестирования:</strong></p>
                    <p>Используйте любой email и пароль от 6 символов</p>
                    <p>Данные сохранятся локально в браузере</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([
        { id: 1, name: 'Еда', type: 'expense', icon: 'fas fa-utensils', color: '#fb8c00' },
        { id: 2, name: 'Транспорт', type: 'expense', icon: 'fas fa-car', color: '#4285f4' },
        { id: 3, name: 'Покупки', type: 'expense', icon: 'fas fa-shopping-bag', color: '#ea4335' },
        { id: 4, name: 'Жилье', type: 'expense', icon: 'fas fa-home', color: '#34a853' },
        { id: 5, name: 'Развлечения', type: 'expense', icon: 'fas fa-film', color: '#ab47bc' },
        { id: 6, name: 'Здоровье', type: 'expense', icon: 'fas fa-heartbeat', color: '#42a5f5' },
        { id: 7, name: 'Образование', type: 'expense', icon: 'fas fa-graduation-cap', color: '#ff9800' },
        { id: 8, name: 'Другое', type: 'expense', icon: 'fas fa-ellipsis-h', color: '#9e9e9e' },
        { id: 9, name: 'Зарплата', type: 'income', icon: 'fas fa-money-check-alt', color: '#34a853' },
        { id: 10, name: 'Фриланс', type: 'income', icon: 'fas fa-laptop-code', color: '#4285f4' },
        { id: 11, name: 'Инвестиции', type: 'income', icon: 'fas fa-chart-line', color: '#ff9800' },
        { id: 12, name: 'Подарок', type: 'income', icon: 'fas fa-gift', color: '#ab47bc' }
    ]);
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const savedUser = localStorage.getItem('user');
                    if (savedUser) {
                        const userData = JSON.parse(savedUser);
                        setUser(userData);
                        
                        const savedTransactions = localStorage.getItem('transactions');
                        const savedAccounts = localStorage.getItem('accounts');
                        
                        if (savedTransactions) {
                            setTransactions(JSON.parse(savedTransactions));
                        }
                        
                        if (savedAccounts) {
                            setAccounts(JSON.parse(savedAccounts));
                        }
                    }
                } catch (error) {
                    console.error('Failed to load saved data:', error);
                    localStorage.clear();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const saveToLocalStorage = (userData, transactionsData, accountsData) => {
        try {
            if (userData) {
                localStorage.setItem('user', JSON.stringify(userData));
            }
            if (transactionsData) {
                localStorage.setItem('transactions', JSON.stringify(transactionsData));
            }
            if (accountsData) {
                localStorage.setItem('accounts', JSON.stringify(accountsData));
            }
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            if (!email || !password) {
                throw new Error('Введите email и пароль');
            }
            
            if (password.length < 6) {
                throw new Error('Пароль должен содержать минимум 6 символов');
            }
            
            const newUser = {
                id: Date.now(),
                email: email,
                name: email.split('@')[0] || 'Пользователь',
                created_at: new Date().toISOString()
            };
            
            const savedUserKey = `user_${email}`;
            const savedTransactionsKey = `transactions_${email}`;
            const savedAccountsKey = `accounts_${email}`;
            
            let userTransactions = [];
            let userAccounts = [];
            
            const savedUser = localStorage.getItem(savedUserKey);
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                
                const savedTransactions = localStorage.getItem(savedTransactionsKey);
                if (savedTransactions) {
                    userTransactions = JSON.parse(savedTransactions);
                }
                
                const savedAccounts = localStorage.getItem(savedAccountsKey);
                if (savedAccounts) {
                    userAccounts = JSON.parse(savedAccounts);
                }
            } else {
                setUser(newUser);
                userTransactions = [];
                userAccounts = [
                    { 
                        id: 1, 
                        name: 'Основной счет', 
                        balance: 0 
                    }
                ];
            }
            
            const demoToken = `token_${Date.now()}`;
            localStorage.setItem('token', demoToken);
            localStorage.setItem('current_user_email', email);
            
            saveToLocalStorage(newUser, userTransactions, userAccounts);
            
            setTransactions(userTransactions);
            setAccounts(userAccounts);
            
            return { success: true };
        } catch (err) {
            const errorMessage = err.message || 'Неверный email или пароль';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, password, name, initialBalance = 0) => {
        setLoading(true);
        setError(null);
        try {
            if (!email || !password || !name) {
                throw new Error('Заполните все обязательные поля');
            }
            
            if (password.length < 6) {
                throw new Error('Пароль должен содержать минимум 6 символов');
            }
            
            if (initialBalance < 0) {
                throw new Error('Начальный баланс не может быть отрицательным');
            }
            
            const newUser = {
                id: Date.now(),
                email: email,
                name: name,
                created_at: new Date().toISOString()
            };
            
            const initialTransactions = [];
            const initialAccounts = [
                { 
                    id: 1, 
                    name: 'Основной счет', 
                    balance: parseFloat(initialBalance) || 0 
                }
            ];
            
            const demoToken = `token_${Date.now()}`;
            localStorage.setItem('token', demoToken);
            localStorage.setItem('current_user_email', email);
            
            const savedUserKey = `user_${email}`;
            const savedTransactionsKey = `transactions_${email}`;
            const savedAccountsKey = `accounts_${email}`;
            
            localStorage.setItem(savedUserKey, JSON.stringify(newUser));
            localStorage.setItem(savedTransactionsKey, JSON.stringify(initialTransactions));
            localStorage.setItem(savedAccountsKey, JSON.stringify(initialAccounts));
            
            saveToLocalStorage(newUser, initialTransactions, initialAccounts);
            
            setUser(newUser);
            setTransactions(initialTransactions);
            setAccounts(initialAccounts);
            
            return { success: true };
        } catch (err) {
            const errorMessage = err.message || 'Ошибка регистрации';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // ИЗМЕНИ ЭТУ ФУНКЦИЮ
    const logout = async () => {
        try {
            // Отправляем запрос на бекенд для добавления токена в blacklist
            await api.logout();
        } catch (error) {
            console.error('Logout API error:', error);
            // Даже если запрос упал, продолжаем очистку фронтенда
        }
        
        // Очищаем localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('transactions');
        localStorage.removeItem('accounts');
        localStorage.removeItem('current_user_email');
        
        // Сбрасываем state
        setUser(null);
        setTransactions([]);
        setAccounts([]);
        setError(null);
    };

    const addTransaction = async (transactionData) => {
        try {
            const newTransaction = {
                id: Date.now(),
                amount: parseFloat(transactionData.amount),
                category: transactionData.category,
                date: transactionData.date || new Date().toISOString(),
                comment: transactionData.comment || '',
                type: transactionData.type,
                account_id: transactionData.account_id || 1
            };
            
            const updatedAccounts = accounts.map(account => {
                if (account.id === (transactionData.account_id || 1)) {
                    const balanceChange = transactionData.type === 'income' 
                        ? parseFloat(transactionData.amount)
                        : -parseFloat(transactionData.amount);
                    return {
                        ...account,
                        balance: (account.balance || 0) + balanceChange
                    };
                }
                return account;
            });
            
            const updatedTransactions = [newTransaction, ...transactions];
            setTransactions(updatedTransactions);
            setAccounts(updatedAccounts);
            
            const currentEmail = localStorage.getItem('current_user_email');
            if (currentEmail) {
                const savedTransactionsKey = `transactions_${currentEmail}`;
                const savedAccountsKey = `accounts_${currentEmail}`;
                
                localStorage.setItem(savedTransactionsKey, JSON.stringify(updatedTransactions));
                localStorage.setItem(savedAccountsKey, JSON.stringify(updatedAccounts));
            }
            
            saveToLocalStorage(user, updatedTransactions, updatedAccounts);
            
            return { success: true, transaction: newTransaction };
        } catch (err) {
            console.error('Failed to add transaction:', err);
            return { success: false, error: err.message };
        }
    };

    const deleteTransaction = async (id) => {
        try {
            const transactionToDelete = transactions.find(t => t.id === id);
            if (!transactionToDelete) {
                throw new Error('Транзакция не найдена');
            }
            
            const updatedAccounts = accounts.map(account => {
                if (account.id === transactionToDelete.account_id) {
                    const balanceChange = transactionToDelete.type === 'income' 
                        ? -transactionToDelete.amount
                        : transactionToDelete.amount;
                    return {
                        ...account,
                        balance: (account.balance || 0) + balanceChange
                    };
                }
                return account;
            });
            
            const updatedTransactions = transactions.filter(t => t.id !== id);
            setTransactions(updatedTransactions);
            setAccounts(updatedAccounts);
            
            const currentEmail = localStorage.getItem('current_user_email');
            if (currentEmail) {
                const savedTransactionsKey = `transactions_${currentEmail}`;
                const savedAccountsKey = `accounts_${currentEmail}`;
                
                localStorage.setItem(savedTransactionsKey, JSON.stringify(updatedTransactions));
                localStorage.setItem(savedAccountsKey, JSON.stringify(updatedAccounts));
            }
            
            saveToLocalStorage(user, updatedTransactions, updatedAccounts);
            
            return { success: true };
        } catch (err) {
            console.error('Failed to delete transaction:', err);
            return { success: false, error: err.message };
        }
    };

    const value = {
        user,
        loading,
        error,
        transactions,
        categories,
        accounts,
        login,
        register,
        logout,
        addTransaction,
        deleteTransaction,
        setError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
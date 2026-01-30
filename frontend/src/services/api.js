const API_BASE_URL = 'http://localhost:8000';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const url = `${API_BASE_URL}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    this.clearToken();
                    throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
                }
                
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = { detail: `HTTP ${response.status}: ${response.statusText}` };
                }
                throw new Error(errorData.detail || 'Произошла ошибка');
            }

            if (response.status === 204 || options.method === 'DELETE') {
                return { success: true };
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    async register(email, password, name, initialBalance = 0) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
        });
    }

    async login(email, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        
        if (response.access_token) {
            this.setToken(response.access_token);
        }
        
        return response;
    }

    // ДОБАВЬ ЭТОТ МЕТОД
    async logout() {
        try {
            const response = await this.request('/auth/logout', {
                method: 'POST',
                body: JSON.stringify({})  // Пустое тело
            });
            this.clearToken();
            return response;
        } catch (error) {
            // Всегда очищаем токен, даже при ошибке
            this.clearToken();
            throw error;
        }
    }

    async getCurrentUser() {
        return this.request('/user/me');
    }

    async getAccount(id) {
        return this.request(`/accounts/${id}`);
    }

    async createAccount(name, balance) {
        return this.request('/accounts/', {
            method: 'POST',
            body: JSON.stringify({ name, balance }),
        });
    }

    async deleteAccount(id) {
        return this.request(`/accounts/${id}`, {
            method: 'DELETE',
        });
    }

    async getTransaction(id) {
        return this.request(`/transactions/${id}`);
    }

    async getIncomeTransactions() {
        return this.request('/transactions/income');
    }

    async getConsumptionTransactions() {
        return this.request('/transactions/consumption');
    }

    async getCategories() {
        return this.request('/transactions/categories');
    }

    async getTransactionsByCategory(category) {
        return this.request(`/transactions/category/${category}`);
    }

    async createTransaction(data) {
        return this.request('/transactions/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async deleteTransaction(id) {
        return this.request(`/transactions/${id}`, {
            method: 'DELETE',
        });
    }
}

export const api = new ApiService();
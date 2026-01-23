import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import AnalyticsPage from './pages/AnalyticsPage';
import TransactionsPage from './pages/TransactionsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './pages/DashboardLayout';

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
        }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#1a73e8' }}></i>
        </div>
        );
    }
    
    return user ? children : <Navigate to="/login" />;
}

function AppContent() {
    const { user } = useAuth();
    const isMobile = window.innerWidth < 768;

    return (
        <div className="app-container">
        <div className="page-container">
            <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/" element={
                <PrivateRoute>
                {isMobile ? <HomePage /> : <DashboardLayout><HomePage /></DashboardLayout>}
                </PrivateRoute>
            } />
            
            <Route path="/analytics" element={
                <PrivateRoute>
                {isMobile ? <AnalyticsPage /> : <DashboardLayout><AnalyticsPage /></DashboardLayout>}
                </PrivateRoute>
            } />
            
            <Route path="/transactions" element={
                <PrivateRoute>
                {isMobile ? <TransactionsPage /> : <DashboardLayout><TransactionsPage /></DashboardLayout>}
                </PrivateRoute>
            } />
            
            <Route path="/settings" element={
                <PrivateRoute>
                {isMobile ? <SettingsPage /> : <DashboardLayout><SettingsPage /></DashboardLayout>}
                </PrivateRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
        </div>
    );
}

function App() {
    return (
        <Router>
        <AuthProvider>
            <AppContent />
        </AuthProvider>
        </Router>
    );
}

export default App;
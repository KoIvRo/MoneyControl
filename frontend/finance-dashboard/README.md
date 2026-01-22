# Frontend for MoneyControl

## For start

In frontend directory
```

text
npm install
npm start
```

or 

with docker

In frontend/
```

text
docker build -t frontend .
docker run -p 3000:3000 frontend
```

## Page

### Authentication

/login - Login page

/register - Registration page

### Main Pages
/ - Home page

/analytics - Analytics page

/transactions - Transactions page

/settings - Settings page

## Features

### Authentication

For authentication using JWT token stored in localStorage.

### Home Page
Display total balance

Quick expense buttons by category

Recent transactions (last 5)

Add income/expense functionality

### Analytics Page
Income/expense pie charts by category

Monthly trends line chart

Filter by time period (month/year/all)

Statistics overview

### Transactions Page
Full transaction history

Filter by type (income/expense), category, date

Add/delete transactions

Monthly summary

### Settings Page
User profile display

Data export to JSON

Account logout

App information

## Component Structure

### Pages
HomePage.js - Main dashboard with balance and quick actions

AnalyticsPage.js - Financial charts and statistics

TransactionsPage.js - Transaction history with filters

SettingsPage.js - User settings and profile

LoginPage.js - User authentication

RegisterPage.js - New user registration

DashboardLayout.js - Desktop layout wrapper

### Components
ChartComponent.js - ECharts wrapper for data visualization

FooterNav.js - Mobile bottom navigation

CategoryItem.js - Category button for quick expenses

TransactionItem.js - Single transaction display

AddTransactionModal.js - Modal for adding transactions

BalanceCard.js - Balance display card

InputField.js - Form input with validation

### Context
AuthContext.js - Authentication and user state management

### Services
api.js - HTTP client for backend API communication

## Tools
React 19.2.3

React Router DOM 7.12.0

ECharts 5.4.1

Font Awesome 6.4.0

Create React App 5.0.1

### Made by
Romanov Yaroslav
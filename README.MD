# MoneyControl

## Smart manager for you finance.

## Project Structure

```
MoneyControl/
├── backend/
│   ├── src/
│   ├── pyproject.toml
│   ├── poetry.lock
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.prod.yml
└── README.md
```

## About

MoneyControl is a web application for personal finance management. The system consists of backend API and frontend React application. Authorization made with PyJWT and redis for token blacklist.

## Backend

The backend provides REST API for user authentication and financial management.

### Backend Technology Stack

* Python 3.12
* FastAPI
* PostgreSQL
* SQLAlchemy
* PyJWT
* Poetry for dependency management

## Frontend

The frontend is a React SPA application for finance management.

### Frontend Technology Stack

* React
* React Router DOM
* Axios for HTTP requests
* CSS

## Docker Setup

The project supports two modes of operation: development and production.

### Production Mode

In production mode, frontend is built into static files.

Start production mode:
```bash
docker-compose -f docker-compose.prod.yml up --build
```

Services:
* Frontend: http://localhost:3000
* Backend: http://localhost:8000

Features:
* Frontend optimized production build
* Files copied into containers

#### FEFU 2025/2026

Applied Mathematics and Computer Science

System programming

#### Made by

* Korotaev Ivan - Teamlead, Architect, Backend
* Romanov Yaroslav - Frontend, Design
* Makarov Dmitry - QA, Analyst
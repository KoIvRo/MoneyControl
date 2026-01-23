# Backend for MoneyControl

## For start

In backend directory
```
poetry install
poetry run startserver
```

or

In src/
```
uvicorn main:app --reload --host=0.0.0.0 --port=8000
```

or with docker

In backend/
```
docker build -t backend .
docker run -p 8000:8000 backend
```

## Documentation

### Authentication
For authentication using JWT token.

### Endpoints

#### Authentication
* `POST /auth/register` (email: str, password: str, name: str)
* `POST /auth/login` (email: str, password: str)

#### User
* `GET /user/me` - Get current user info with accounts and transactions

#### Accounts
* `GET /accounts/{id}` - Get account by ID
* `POST /accounts/` - Create new account
* `DELETE /accounts/{id}` - Delete account

#### Transactions
* `GET /transactions/{id}` - Get transaction by ID
* `GET /transactions/income` - Get all income transactions
* `GET /transactions/consumption` - Get all consumption transactions  
* `GET /transactions/categories` - Get all unique transaction categories
* `GET /transactions/category/{category}` - Get transactions by category
* `POST /transactions/` - Create new transaction
* `DELETE /transactions/{id}` - Delete transaction

## API Examples

### Authentication
```
curl -X POST "http://localhost:8000/auth/register" -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"mypassword123\",\"name\":\"Ivan\"}"
```
```
curl -X POST "http://localhost:8000/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"mypassword123\"}"
```

### User
```
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwidXNlcl9pZCI6MX0.n2bhlHwTGFpTx6W2WOeAw7_rQUhO1umGHiv9XYLOBxc" http://localhost:8000/user/me
```

### Accounts
```
curl -X POST "http://localhost:8000/accounts/" -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwidXNlcl9pZCI6MX0.n2bhlHwTGFpTx6W2WOeAw7_rQUhO1umGHiv9XYLOBxc" -d "{\"name\":\"Основной счет\",\"balance\":1000.0}"
```
```
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwidXNlcl9pZCI6MX0.n2bhlHwTGFpTx6W2WOeAw7_rQUhO1umGHiv9XYLOBxc" http://localhost:8000/accounts/1
```
```
curl -X DELETE "http://localhost:8000/accounts/2" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwidXNlcl9pZCI6MX0.n2bhlHwTGFpTx6W2WOeAw7_rQUhO1umGHiv9XYLOBxc"
```

### Transactions
```
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwidXNlcl9pZCI6MX0.n2bhlHwTGFpTx6W2WOeAw7_rQUhO1umGHiv9XYLOBxc" http://localhost:8000/transactions/1
```
```
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwidXNlcl9pZCI6MX0.n2bhlHwTGFpTx6W2WOeAw7_rQUhO1umGHiv9XYLOBxc" http://localhost:8000/transactions/income
```
```
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwidXNlcl9pZCI6MX0.n2bhlHwTGFpTx6W2WOeAw7_rQUhO1umGHiv9XYLOBxc" http://localhost:8000/transactions/consumption
```
```
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwidXNlcl9pZCI6MX0.n2bhlHwTGFpTx6W2WOeAw7_rQUhO1umGHiv9XYLOBxc" http://localhost:8000/transactions/categories
```
```
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwidXNlcl9pZCI6MX0.n2bhlHwTGFpTx6W2WOeAw7_rQUhO1umGHiv9XYLOBxc" http://localhost:8000/transactions/category/Salary
```
```
curl -X POST "http://localhost:8000/transactions/" -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwidXNlcl9pZCI6MX0.n2bhlHwTGFpTx6W2WOeAw7_rQUhO1umGHiv9XYLOBxc" -d "{\"amount\":1500,\"category\":\"Salary\",\"date\":\"2024-01-15T14:30:00\",\"comment\":\"Monthly salary\",\"account_id\":1}"
```
```
curl -X DELETE "http://localhost:8000/transactions/2" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwidXNlcl9pZCI6MX0.n2bhlHwTGFpTx6W2WOeAw7_rQUhO1umGHiv9XYLOBxc"
```

## Tools
* Python
* FastAPI
* uvicorn
* SQLite
* SQLalchemy
* PyJWT

### Made by
* Korotaev Ivan

# Muuse Product Events API

A Docker-based PostgreSQL reporting system with Node.js API for tracking product borrowing events and user payment methods.

## Features

- **Lost Products Tracking** - Identify products borrowed for 3+ months without return
- **Expiring Payment Warnings** - Monitor active borrows where user's payment method expires within 30 days
- **RESTful API** - Clean API with Swagger documentation
- **Docker Setup** - Easy database deployment with sample data

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Node.js](https://nodejs.org/) v18 or higher
- [pnpm](https://pnpm.io/) (or npm/yarn)

## Quick Start

### 1. Set up environment files

Create `.env` in the project root for Docker:

```env
POSTGRES_PASSWORD=password123!
POSTGRES_USER=postgres
POSTGRES_DB=postgres
PGDATA=/var/lib/postgresql/data
```

Create `.env` in the `api/` folder for the API server:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=reporting
DB_USER=postgres
DB_PASSWORD=password123!
```

### 2. Start the database

```bash
docker-compose up --build
```

Wait until you see the database is ready to accept connections.

### 3. Install API dependencies

Open a new terminal:

```bash
cd api
pnpm install
```

### 4. Start the API server

```bash
pnpm start
```

### 5. Verify the setup

Open your browser to [http://localhost:3000/api-docs](http://localhost:3000/api-docs) to see the Swagger documentation.

---

## How-to Guides

### Start the database only

```bash
docker-compose up --build
```

### Start the API in development mode (auto-reload)

```bash
cd api
pnpm run dev
```


## API Reference

**Base URL:** `http://localhost:3000`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products/lost` | Get products not returned after 3 months |
| GET | `/api/products/expiring-payments` | Get borrows with expiring payment methods |
| GET | `/api-docs` | Swagger UI documentation |

### Health Check

```bash
curl http://localhost:3000/api/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Get Lost Products

Returns products that were borrowed 3+ months ago and never returned.

```bash
curl http://localhost:3000/api/products/lost
```

Response:

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "productId": "PROD-001",
      "userId": "USR-123",
      "location": "Store A",
      "lastBorrowDate": "2024-01-15T10:00:00.000Z",
      "transactionId": "TXN-001",
      "daysSinceBorrow": 95
    }
  ]
}
```

### Get Expiring Payment Borrows

Returns active borrows where the user's payment method expires within 30 days (or is already expired).

```bash
curl http://localhost:3000/api/products/expiring-payments
```

Response:

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "productId": "PROD-002",
      "userId": "USR-456",
      "borrowDate": "2024-12-01T10:00:00.000Z",
      "location": "Store B",
      "transactionId": "TXN-002",
      "paymentValidUntil": "01/25",
      "paymentExpiryDate": "2025-01-31",
      "paymentStatus": "warning"
    }
  ]
}
```

**Payment Status Values:**
- `expired` - Payment method has already expired
- `critical` - Expires within 7 days
- `warning` - Expires within 30 days
- `ok` - Valid for more than 30 days

---

## Database Reference

### Connection Details

| Setting  | Value              |
|----------|--------------------|
| Host     | `localhost`        |
| Port     | `5432`             |
| Database | `reporting`        |
| Username | `postgres`         |
| Password | (from your .env)   |

### Connection String

```
postgresql://postgres:your_password@localhost:5432/reporting
```

### Schema

#### `user_events`

Tracks user activity events.

| Column        | Type                  | Description                    |
|---------------|-----------------------|--------------------------------|
| id            | SERIAL PRIMARY KEY    | Auto-increment ID              |
| evt_type      | VARCHAR(255)          | Event type (signup, add-payment-method) |
| user_id       | VARCHAR(100)          | User identifier                |
| evt_date      | TIMESTAMP             | When the event occurred        |
| platform      | VARCHAR(50)           | Platform (app, web)            |
| meta          | VARCHAR(1024)         | JSON metadata                  |
| created       | TIMESTAMP             | Record creation time           |
| last_modified | TIMESTAMP             | Record last modified time      |

#### `product_events`

Tracks product borrow/return transactions.

| Column         | Type                  | Description                    |
|----------------|-----------------------|--------------------------------|
| id             | SERIAL PRIMARY KEY    | Auto-increment ID              |
| evt_type       | VARCHAR(255)          | Event type (borrow, return)    |
| user_id        | VARCHAR(100)          | User identifier                |
| product_id     | VARCHAR(100)          | Product identifier             |
| location_id    | VARCHAR(100)          | Location identifier            |
| location       | VARCHAR(255)          | Location name                  |
| evt_date       | TIMESTAMP             | When the event occurred        |
| transaction_id | VARCHAR(100)          | Transaction identifier         |
| platform       | VARCHAR(50)           | Platform (app, web)            |
| meta           | VARCHAR(1024)         | JSON metadata                  |
| created        | TIMESTAMP             | Record creation time           |
| last_modified  | TIMESTAMP             | Record last modified time      |

---

## Project Structure

```
db-task/
├── api/                              # Node.js Express API
│   ├── src/
│   │   ├── index.js                  # Application entry point
│   │   ├── app.js                    # Express app setup
│   │   ├── config/                   # Configuration files
│   │   ├── controllers/              # Request handlers
│   │   ├── services/                 # Business logic
│   │   ├── repositories/             # Database queries
│   │   ├── routes/                   # API route definitions
│   │   ├── middleware/               # Error handlers
│   │   ├── utils/                    # Helper utilities
│   │   └── swagger/                  # API documentation
│   ├── docs/                         # SQL documentation
│   └── package.json
├── runtime/
│   └── docker-entrypoint-initdb.d/   # Database init scripts
│       ├── 001_createdb.sql          # Create tables
│       └── 002_load_data.sql         # Load sample data
├── docker-compose.yml                # Docker orchestration
├── Dockerfile                        # PostgreSQL container
└── .env                              # Environment variables
```

# Muuse Product Events API

A Docker-based PostgreSQL reporting system with Node.js API for tracking product borrowing events and user payment methods.


---

## Deliverables

### 1. Summary of Work Completed

Built a complete reporting API system that solves two business problems:

| Task | Description | Status |
|------|-------------|--------|
| **Task 1** | Database setup with PostgreSQL + Docker | ✅ Complete |
| **Task 2** | SQL query for lost/unreturned products | ✅ Complete |
| **Task 3** | SQL query for expiring payment methods | ✅ Complete |
| **Task 4** | REST API implementation | ✅ Complete |

**Key accomplishments:**
- Designed and implemented PostgreSQL schema with `user_events` and `product_events` tables
- Wrote optimized SQL queries using `NOT EXISTS` and `DISTINCT ON` patterns
- Built Node.js/Express API with clean architecture (Repository → Service → Controller)
- Added Swagger/OpenAPI documentation for all endpoints
- Created Docker setup for easy deployment with sample data

---

### 2. SQL Statements and Results

#### Task 2: Find Lost Products (Unreturned for 3+ Months)

**SQL Query:**
```sql
SELECT
  pe.product_id,
  pe.user_id,
  pe.location,
  pe.evt_date AS borrow_date,
  pe.transaction_id,
  pe.location_id,
  pe.platform
FROM product_events pe
WHERE pe.evt_type = 'borrow'
  AND pe.evt_date < NOW() - INTERVAL '3 months'
  AND NOT EXISTS (
    SELECT 1
    FROM product_events ret
    WHERE ret.evt_type = 'return'
      AND ret.transaction_id = pe.transaction_id
  )
ORDER BY pe.evt_date ASC;
```

**Query Result (Sample Data):**
| product_id | user_id | location | borrow_date | transaction_id | days_since_borrow |
|------------|---------|----------|-------------|----------------|-------------------|
| 1 | 3 | LOC A | 2024-01-23 14:00:00 | 5 | 362 |
| 4 | 4 | LOC B | 2024-01-09 09:00:00 | 7 | 376 |

---

#### Task 3: Find Borrows with Expiring Payment Methods

**SQL Query 1 - Get Active Borrows:**
```sql
SELECT
  pe.product_id,
  pe.user_id,
  pe.location,
  pe.evt_date AS borrow_date,
  pe.transaction_id,
  pe.location_id,
  pe.platform
FROM product_events pe
WHERE pe.evt_type = 'borrow'
  AND NOT EXISTS (
    SELECT 1
    FROM product_events ret
    WHERE ret.evt_type = 'return'
      AND ret.transaction_id = pe.transaction_id
  )
ORDER BY pe.evt_date ASC;
```

**SQL Query 2 - Get Latest Payment Methods:**
```sql
SELECT DISTINCT ON (user_id)
  user_id,
  evt_date,
  platform,
  meta
FROM user_events
WHERE evt_type = 'add-payment-method'
ORDER BY user_id, evt_date DESC;
```

**Combined Query Result (Sample Data):**
| product_id | user_id | location | borrow_date | payment_valid_until | payment_status |
|------------|---------|----------|-------------|---------------------|----------------|
| 4 | 4 | LOC B | 2024-01-09 09:00:00 | 01/24 | expired |

---

### 3. Source Code for Task 4

The API source code is located in the `api/` directory:

```
api/
├── src/
│   ├── index.js                  # Application entry point
│   ├── app.js                    # Express app setup
│   ├── config/
│   │   ├── database.js           # PostgreSQL connection pool
│   │   └── index.js              # Environment configuration
│   ├── controllers/
│   │   ├── product.controller.js # Product endpoint handlers
│   │   └── health.controller.js  # Health check handler
│   ├── services/
│   │   └── product.service.js    # Business logic layer
│   ├── repositories/
│   │   ├── base.repository.js    # Base repository class
│   │   ├── productEvent.repository.js  # Product queries
│   │   └── userEvent.repository.js     # User queries
│   ├── routes/
│   │   ├── index.js              # Route registration
│   │   ├── product.routes.js     # Product routes
│   │   └── health.routes.js      # Health routes
│   ├── middleware/
│   │   └── errorHandler.js       # Global error handler
│   ├── utils/
│   │   ├── dateUtils.js          # Date parsing utilities
│   │   ├── responseFormatter.js  # Response formatting
│   │   └── AppError.js           # Custom error class
│   └── swagger/
│       └── swagger.js            # OpenAPI specification
├── docs/
│   └── queries.md                # SQL documentation
└── package.json
```

**Key API Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products/lost` | Get unreturned products (3+ months) |
| GET | `/api/products/expiring-payments` | Get borrows with expiring payment methods |
| GET | `/api-docs` | Swagger documentation |

---

### 4. Documentation

#### Architecture

The API follows a layered architecture pattern:

```
Request → Routes → Controllers → Services → Repositories → Database
```

| Layer | Responsibility |
|-------|----------------|
| **Routes** | Define endpoints, apply middleware, Swagger docs |
| **Controllers** | Handle HTTP requests/responses |
| **Services** | Business logic, data transformation |
| **Repositories** | Database queries, data access |

#### Query Strategy

Two SQL patterns were chosen for the queries:

1. **NOT EXISTS** - Used for finding unreturned products
   - Clear intent, NULL-safe, well-optimized by PostgreSQL
   - Stops at first match (efficient)

2. **DISTINCT ON** - Used for getting latest payment per user
   - PostgreSQL-specific, elegant solution for "most recent per group"
   - Single query instead of subquery with MAX()

See [QUERY_APPROACHES.md](./QUERY_APPROACHES.md) for detailed comparison of alternative approaches.

#### Payment Status Logic

Payment expiry dates (MM/YY format) are converted to the last day of that month:
- `01/25` → `2025-01-31`

Status thresholds:
| Status | Condition |
|--------|-----------|
| `expired` | Already past expiry date |
| `critical` | Expires within 7 days |
| `warning` | Expires within 30 days |
| `ok` | Valid for 30+ days |

---

### 5. Time Spent
<img width="1469" height="920" alt="image" src="https://github.com/user-attachments/assets/3990cf14-3f2e-4944-9628-2c4e43063b14" />


| Task | Time |
|------|------|
| Docker setup, SQL queries & analysis | 00:52:04 |
| API development (Express, SOLID/DRY, Swagger) | 03:06:01 |
| **Total** | **03:58:05** |

*Time tracked using [Clockify](https://clockify.me)*

---

### Questions?

Feel free to reach out if you have any questions about the implementation!

---
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
├── QUERY_APPROACHES.md               # SQL query strategies documentation
└── .env                              # Environment variables
```

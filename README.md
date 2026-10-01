# UASS Real-Time Monitoring and Visualization System

A production-oriented MERN stack web application for monitoring and visualizing **Upper Air Sounding System (UASS)** atmospheric observations. Supports simulated real-time data collection, historical data exploration, role-based access control, and a professional scientific monitoring dashboard.

> **Note:** This application uses **simulated data** for development and demonstration. It does not connect to real UASS hardware. See [Future Hardware Integration](#future-hardware-integration) for how to add a real adapter.

---

## Features

-  **Secure authentication** â€” JWT in HTTP-only cookies, bcrypt password hashing
-  **Role-based access control** â€” Admin, Operator, Viewer with backend enforcement
-  **Real-time dashboard** â€” Temperature, pressure, humidity, and altitude profile charts
-  **Live data via Socket.IO** â€” Authenticated websocket feed for real-time observations
-  **Historical observations** â€” Paginated table with date, altitude, and source filtering
-  **CSV export** â€” Filtered observation export (up to 10,000 records)
-  **Data collection control** â€” Start/stop simulated sounding sessions
-  **Audit logs** â€” Full security event history for admin review
-  **Security-first** â€” Helmet, CORS, rate limiting, Zod validation, NoSQL injection prevention

---

## Technology Stack

### Backend
| Package | Purpose |
|---------|---------|
| **Express.js** | HTTP web framework |
| **Mongoose** | MongoDB object modeling and schema validation |
| **jsonwebtoken** | JWT creation and verification for auth |
| **bcrypt** | Secure password hashing (cost factor 12) |
| **zod** | Runtime request validation (body, query, params) |
| **helmet** | Security headers (XSS, clickjacking, etc.) |
| **cors** | CORS with explicit allowed origin |
| **express-rate-limit** | Brute-force protection on login endpoint |
| **cookie-parser** | HTTP-only cookie reading |
| **pino** | Structured JSON logging (no console.log) |
| **socket.io** | Real-time bidirectional communication |
| **dotenv** | Environment variable loading |

### Frontend
| Package | Purpose |
|---------|---------|
| **React 19** | UI component library |
| **Vite** | Fast dev server and build tool |
| **Tailwind CSS v4** | Utility-first CSS framework |
| **React Router DOM v7** | Client-side routing |
| **Axios** | HTTP client with cookie support |
| **Recharts** | Composable charting library |
| **socket.io-client** | Real-time socket connection |
| **react-hook-form** | Performant form state management |
| **@hookform/resolvers + zod** | Schema-based form validation |
| **react-hot-toast** | Toast notifications |

### Testing
| Package | Purpose |
|---------|---------|
| **Vitest** | Frontend unit test runner |
| **@testing-library/react** | React component testing utilities |
| **Jest** | Backend test runner |
| **Supertest** | HTTP assertion for Express routes |

---

## Architecture

```
UASS-Monitoring-System/
â”œâ”€â”€ client/          # React frontend (Vite)
â”œâ”€â”€ server/          # Node.js/Express backend
â”œâ”€â”€ docs/            # API, architecture, and data format documentation
â”œâ”€â”€ .gitignore
â”œâ”€â”€ package.json     # Root convenience scripts
â””â”€â”€ README.md
```

### Backend Architecture (MVC)

```text
server/src/
├── config/          # Environment validation, database connection
├── controllers/     # Request handlers (auth, users, etc.)
├── middleware/      # auth, validation, error handler
├── models/          # Mongoose ODM schemas
├── routes/          # Express route definitions
├── services/        # Business logic
├── validators/      # Zod validation schemas
├── sockets/         # Socket.IO handlers
├── collectors/      # Hardware/simulator data ingestion
├── utils/           # Helpers (logger, response, ApiError)
├── scripts/         # DB seeders
├── app.js
└── server.js
```

## Installation

### Prerequisites
- Node.js >= 20.0.0
- MongoDB >= 6.0

### 1. Clone and install all dependencies
```bash
npm install
npm run install:all
```

### 2. Environment setup
Copy the example environment files:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### 3. Create the first admin account
```bash
npm run seed --prefix server
```

## Running the Application

### Start the backend (development)
```bash
npm run dev:server
```

### Start the frontend (development)
```bash
npm run dev:client
```

## Running Tests

### Backend tests
```bash
npm run test:server
```

### Frontend tests

```bash
npm run test:client
```

---

## API Overview

Base URL: `/api/v1`

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | /auth/login | â€” | â€” |
| POST | /auth/logout | âœ“ | any |
| GET | /auth/me | âœ“ | any |
| GET | /users | âœ“ | admin |
| POST | /users | âœ“ | admin |
| PATCH | /users/:id | âœ“ | admin |
| DELETE | /users/:id | âœ“ | admin |
| GET | /observations | âœ“ | any |
| POST | /observations | âœ“ | admin, operator |
| PATCH | /observations/:id | âœ“ | admin, operator |
| DELETE | /observations/:id | âœ“ | admin |
| GET | /observations/export | âœ“ | admin, operator |
| GET | /collections | âœ“ | any |
| POST | /collections/start | âœ“ | admin, operator |
| POST | /collections/:id/stop | âœ“ | admin, operator |
| GET | /dashboard/summary | âœ“ | any |
| GET | /dashboard/latest | âœ“ | any |
| GET | /audit-logs | âœ“ | admin |

Full documentation: [docs/API.md](docs/API.md)

---

## Simulated Data

The simulator generates plausible Upper Air Sounding observations using a simplified International Standard Atmosphere (ISA) model:

- **Temperature:** Decreases at ~6.5Â°C/1,000m with Â±2Â°C noise
- **Pressure:** Exponential decrease with altitude (barometric formula)
- **Humidity:** Decreases with altitude, 0â€“100% RH
- **Wind speed:** Increases with altitude toward jet stream level
- **Wind direction:** Slowly drifting random walk

All simulated observations have `source: "simulated"` and are clearly marked in the UI.

The simulator cycles through altitudes from 0 to 30,000m in 500m steps, generating one observation per `SIMULATOR_INTERVAL_MS` (default: 3,000ms).

See [docs/DATA_FORMAT.md](docs/DATA_FORMAT.md) for the full data format specification.

---

## Future Hardware Integration

To connect real UASS hardware (RS41 radiosonde, TCP socket receiver, etc.), implement the `IDataSource` interface:

```js
class MyHardwareSource {
  start(sessionId, onObservation, onError) { /* read from hardware */ }
  stop() { /* release resources */ }
  getSourceName() { return 'rs41-serial'; }
}
```

Then replace `SimulatorDataSource` with your implementation in `collection.service.js`. The dashboard, Socket.IO broadcast, and database layer require no changes.

See [docs/DATA_FORMAT.md](docs/DATA_FORMAT.md) for the exact observation payload format.

---

## Security Notes

- **JWTs are never stored in localStorage** â€” HTTP-only cookies only
- **Password hashing** uses bcrypt with cost factor 12
- **Timing-safe login** â€” bcrypt runs even for non-existent users to prevent user enumeration
- **Rate limiting** on `/auth/login` â€” 10 attempts per 15 minutes per IP
- **Helmet** sets security headers (HSTS, XSS filter, content-type sniffing)
- **CORS** allows only the configured `CLIENT_URL` origin
- **Zod validation** on all request inputs â€” prevents NaN, Infinity, oversized payloads
- **Mongoose `sanitizeFilter`** prevents NoSQL injection
- **Audit logging** tracks all security-sensitive actions (no passwords or tokens logged)
- **Role-based authorization** enforced on every protected backend route
- Never commit `.env` files â€” only `.env.example` is tracked

---

## Folder Structure

```text
UASS-Monitoring-System/
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   ├── common/
│   │   │   └── layout/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── test/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── server/
│   ├── src/
│   │   ├── collectors/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── scripts/
│   │   ├── services/
│   │   ├── sockets/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── docs/
├── scripts/
│   └── maintenance/
├── .gitignore
├── package.json
└── README.md
```



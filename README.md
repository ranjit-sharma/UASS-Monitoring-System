
# 🌤️ UASS Real-Time Monitoring & Visualization System

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6%2B-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000?logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-010101?logo=socket.io&logoColor=white)](https://socket.io/)
[![Axios](https://img.shields.io/badge/Axios-HTTP-5A29E4?logo=axios&logoColor=white)](https://axios-http.com/)
[![Recharts](https://img.shields.io/badge/Recharts-Visualization-FF6384?logo=chartdotjs&logoColor=white)](https://recharts.org/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Jest](https://img.shields.io/badge/Jest-Testing-C21325?logo=jest&logoColor=white)](https://jestjs.io/)
[![Vitest](https://img.shields.io/badge/Vitest-Testing-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

A **production-oriented MERN stack web application** for monitoring and visualizing **Upper Air Sounding System (UASS)** atmospheric observations. The system provides a centralized platform for **real-time data monitoring, visualization, historical analysis, role-based access control, and telemetry management** through a professional scientific monitoring dashboard.

> **Note:** The current application uses **simulated telemetry data** for development, testing, and demonstration. It does not directly connect to real UASS hardware. The architecture is designed to support future hardware integration through a dedicated data-source adapter.

---

## 🚀 Features

- 🔐 **Secure Authentication** — JWT-based authentication using HTTP-only cookies and bcrypt password hashing.
- 👥 **Role-Based Access Control** — Supports **Admin, Operator, and Viewer** roles with backend authorization.
- 📊 **Real-Time Monitoring Dashboard** — Displays atmospheric parameters such as temperature, pressure, humidity, and altitude.
- ⚡ **Real-Time Data Streaming** — Uses **Socket.IO** for authenticated real-time observation updates.
- 📈 **Interactive Data Visualization** — Provides altitude profiles, sensor graphs, and real-time charts.
- 📋 **Historical Observations** — Paginated observation table with date, altitude, and source-based filtering.
- 📤 **CSV Export** — Export filtered observation records for further analysis.
- 🎛️ **Data Collection Control** — Start and stop simulated sounding sessions.
- 🛰️ **Telemetry Simulation** — Generates realistic atmospheric observations for development and testing.
- 📝 **Audit Logging** — Records security-sensitive and administrative activities.
- 🛡️ **Security-Focused Architecture** — Includes Helmet, CORS, rate limiting, Zod validation, and NoSQL injection protection.
- 📱 **Responsive Interface** — Designed to work across desktop, tablet, and mobile screen sizes.

---

# 🛠️ Technology Stack

## Backend

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | REST API and HTTP server |
| **Mongoose** | MongoDB ODM and schema validation |
| **MongoDB** | Database |
| **JSON Web Token (JWT)** | Authentication |
| **bcrypt** | Password hashing |
| **Zod** | Runtime request validation |
| **Helmet** | HTTP security headers |
| **CORS** | Cross-origin request security |
| **express-rate-limit** | Brute-force protection |
| **cookie-parser** | HTTP-only cookie handling |
| **Pino** | Structured application logging |
| **Socket.IO** | Real-time communication |
| **dotenv** | Environment configuration |

## Frontend

| Technology | Purpose |
|---|---|
| **React 19** | User interface |
| **Vite** | Development server and build tool |
| **Tailwind CSS v4** | Styling and responsive design |
| **React Router DOM v7** | Client-side routing |
| **Axios** | API communication |
| **Recharts** | Data visualization |
| **Socket.IO Client** | Real-time communication |
| **React Hook Form** | Form management |
| **Zod** | Form validation |
| **React Hot Toast** | Notifications |

## Testing

| Technology | Purpose |
|---|---|
| **Vitest** | Frontend unit testing |
| **React Testing Library** | React component testing |
| **Jest** | Backend testing |
| **Supertest** | Express API testing |

---

# 🏗️ System Architecture

The application follows a **MERN-based modular architecture** with **MVC principles on the backend**.

```text
                    UASS MONITORING SYSTEM
                             │
             ┌───────────────┴───────────────┐
             │                               │
        React Frontend                  Express Backend
             │                               │
     ┌───────┼────────┐              ┌───────┼────────┐
     │       │        │              │       │        │
   Pages  Components Services      Routes Controllers Services
     │       │        │              │       │        │
     └───────┼────────┘              └───────┼────────┘
             │                               │
             │                           Collectors
             │                               │
             │                    ┌──────────┼──────────┐
             │                    │          │          │
             │                   LAN      Serial      Simulator
             │                    │          │          │
             │                    └──────────┼──────────┘
             │                               │
             │                          Data Processing
             │                               │
             │                          Validation
             │                               │
             │                           MongoDB
             │                               │
             └──────────── Socket.IO ────────┘
```

---

# 📁 Project Structure

```text
UASS-Monitoring-System/
│
├── client/                         # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/                 # Images, icons, static assets
│   │   ├── components/             # Reusable UI components
│   │   │   ├── charts/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── forms/
│   │   │   ├── layout/
│   │   │   └── tracking/
│   │   ├── context/                # Global React state/context
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── pages/                  # Application pages
│   │   ├── routes/                 # Frontend routing
│   │   ├── services/               # API and Socket.IO services
│   │   ├── styles/                 # Global and shared styles
│   │   ├── themes/                 # Application themes
│   │   ├── utils/                  # Frontend utilities
│   │   ├── constants/              # Frontend constants
│   │   ├── test/                   # Frontend tests
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── server/                         # Node.js + Express backend
│   ├── src/
│   │   ├── config/                 # Database and environment config
│   │   ├── controllers/            # HTTP request handlers
│   │   ├── middleware/             # Auth, validation, error handling
│   │   ├── models/                 # Mongoose models
│   │   ├── routes/                 # Express API routes
│   │   ├── services/               # Business logic
│   │   ├── validators/             # Zod validation schemas
│   │   ├── sockets/                # Socket.IO handlers
│   │   ├── collectors/             # Data-source implementations
│   │   ├── utils/                  # Backend utility functions
│   │   ├── constants/              # Backend constants
│   │   ├── scripts/                # Database/maintenance scripts
│   │   ├── app.js                  # Express application
│   │   └── server.js               # Server entry point
│   ├── tests/                      # Backend tests
│   ├── .env.example
│   └── package.json
│
├── docs/                           # Project documentation
│   ├── API.md
│   ├── DATA_FORMAT.md
│   └── architecture/
│
├── scripts/                        # Project-level maintenance scripts
│   └── maintenance/
│
├── .gitignore
├── package.json
└── README.md
```

---

# 🧩 Backend MVC Architecture

The backend follows **MVC architecture with a service layer**.

```text
Client Request
      │
      ▼
    Route
      │
      ▼
  Middleware
      │
      ├── Authentication
      ├── Authorization
      └── Validation
      │
      ▼
  Controller
      │
      ▼
   Service
      │
      ▼
 Model / Repository
      │
      ▼
   MongoDB
      │
      ▼
 JSON Response
```

### Backend Responsibilities

- **Routes** — Define API endpoints.
- **Controllers** — Handle HTTP requests and responses.
- **Services** — Contain business logic.
- **Models** — Define MongoDB schemas.
- **Middleware** — Authentication, authorization, validation, and error handling.
- **Validators** — Validate request data using Zod.
- **Collectors** — Handle simulated and future hardware data sources.
- **Sockets** — Handle real-time Socket.IO communication.
- **Config** — Manage database and environment configuration.
- **Utils** — Provide reusable helper functions.

---

# 📡 Data Collection Architecture

The application uses a common data-processing pipeline so different data sources can eventually feed the same dashboard.

```text
              Data Source
                   │
       ┌───────────┼───────────┐
       │           │           │
      LAN       Serial      Simulator
       │           │           │
       └───────────┼───────────┘
                   │
                   ▼
            Data Normalization
                   │
                   ▼
               Validation
                   │
                   ▼
          Observation Service
              │         │
              ▼         ▼
           MongoDB   Socket.IO
                        │
                        ▼
                 React Dashboard
```

The current implementation uses the **simulator** for development and testing.

---

# 📊 Simulated Telemetry

The simulator generates plausible upper-air observations using a simplified **International Standard Atmosphere (ISA)** model.

The generated parameters include:

- **Temperature**
- **Pressure**
- **Humidity**
- **Wind Speed**
- **Wind Direction**
- **Altitude**

### Simulation Behavior

- Altitude range: **0–30,000 meters**
- Altitude step: **500 meters**
- Default observation interval: **3 seconds**
- Data source is explicitly marked as:

```text
source: "simulated"
```

The simulated data is clearly identified in the application so that it is not confused with actual instrument measurements.

For the complete observation payload, see:

`docs/DATA_FORMAT.md`

---

# 🔐 Authentication & Security

The application follows a security-first approach.

## Authentication

- JWT-based authentication
- JWT stored in **HTTP-only cookies**
- Password hashing using **bcrypt**
- Role-based authorization

## User Roles

| Role | Access |
|---|---|
| **Admin** | Full system and user management |
| **Operator** | Data collection and observation operations |
| **Viewer** | Monitoring and read-only access |

## Security Measures

- Helmet security headers
- Explicit CORS configuration
- Login rate limiting
- Zod request validation
- Mongoose filter sanitization
- HTTP-only cookies
- Password hashing
- Role-based backend authorization
- Audit logging
- Environment variable protection

> `.env` files should never be committed to Git. Only `.env.example` files should be tracked.

---

# 🔌 API Overview

Base URL:

```text
/api/v1
```

| Method | Endpoint | Authentication | Role |
|---|---|---|---|
| POST | `/auth/login` | No | — |
| POST | `/auth/logout` | Yes | Any |
| GET | `/auth/me` | Yes | Any |
| GET | `/users` | Yes | Admin |
| POST | `/users` | Yes | Admin |
| PATCH | `/users/:id` | Yes | Admin |
| DELETE | `/users/:id` | Yes | Admin |
| GET | `/observations` | Yes | Any |
| POST | `/observations` | Yes | Admin, Operator |
| PATCH | `/observations/:id` | Yes | Admin, Operator |
| DELETE | `/observations/:id` | Yes | Admin |
| GET | `/observations/export` | Yes | Admin, Operator |
| GET | `/collections` | Yes | Any |
| POST | `/collections/start` | Yes | Admin, Operator |
| POST | `/collections/:id/stop` | Yes | Admin, Operator |
| GET | `/dashboard/summary` | Yes | Any |
| GET | `/dashboard/latest` | Yes | Any |
| GET | `/audit-logs` | Yes | Admin |

Detailed API documentation:

`docs/API.md`

---

# ⚡ Real-Time Communication

**Socket.IO** is used for real-time observation updates.

```text
Data Collector
      │
      ▼
Observation Service
      │
      ├──────────► MongoDB
      │
      ▼
   Socket.IO
      │
      ▼
React Dashboard
      │
      ├── Charts
      ├── Status
      ├── Alerts
      └── Live Data
```

This allows the dashboard to receive new observations without requiring continuous page refreshes.

---

# 📦 Installation

## Prerequisites

- **Node.js >= 20**
- **MongoDB >= 6**

## 1. Clone the Repository

```bash
git clone <repository-url>
cd UASS-Monitoring-System
```

## 2. Install Dependencies

```bash
npm install
npm run install:all
```

## 3. Configure Environment Variables

Create the environment files from the examples:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

On Windows, manually copy `.env.example` to `.env` if the `cp` command is unavailable.

Then configure the required environment variables.

---

# 👤 Create Admin Account

Run the database seeder:

```bash
npm run seed --prefix server
```

This creates the initial administrator account according to the project's seed configuration.

---

# ▶️ Running the Application

## Start Backend

```bash
npm run dev:server
```

## Start Frontend

Open another terminal:

```bash
npm run dev:client
```

---

# 🧪 Testing

## Backend Tests

```bash
npm run test:server
```

## Frontend Tests

```bash
npm run test:client
```

---

# 🔮 Future Hardware Integration

The application is designed so that real UASS hardware can be integrated without changing the dashboard, Socket.IO layer, or database architecture.

A hardware-specific adapter can implement the common data-source interface:

```javascript
class MyHardwareSource {
    start(sessionId, onObservation, onError) {
        // Read and process hardware data
    }

    stop() {
        // Release hardware resources
    }

    getSourceName() {
        return "hardware-source";
    }
}
```

The new adapter can then be connected to the existing collection service.

```text
Real UASS Hardware
        │
        ▼
 Hardware Adapter
        │
        ▼
 Common Observation Format
        │
        ▼
 Existing Processing Pipeline
        │
        ├── MongoDB
        └── Socket.IO
               │
               ▼
         Existing Dashboard
```

> **Important:** Actual UASS communication protocols, serial settings, LAN configuration, telemetry formats, and hardware-specific parameters should only be implemented using authorized technical documentation and verified device specifications.

---

# 📚 Documentation

```text
docs/
├── API.md
├── DATA_FORMAT.md
└── architecture/
```

- **API.md** — REST API documentation
- **DATA_FORMAT.md** — Observation payload and data format
- **architecture/** — System architecture documentation

---

# 🔒 Security Notes

- JWTs are **not stored in localStorage**.
- Authentication tokens are stored using **HTTP-only cookies**.
- Passwords are hashed using **bcrypt**.
- Login attempts are rate-limited.
- Helmet provides security-related HTTP headers.
- CORS restricts requests to the configured frontend origin.
- Zod validates incoming request data.
- MongoDB filters are sanitized against NoSQL injection.
- Role-based authorization is enforced on protected routes.
- Security-sensitive actions are recorded in audit logs.
- Passwords, tokens, and sensitive credentials are not logged.
- `.env` files must never be committed to the repository.

---

# 👨‍💻 Project Status

**Current Status:** 🚧 **Under Development**

The current version focuses on the **monitoring dashboard, simulated telemetry, data processing, visualization, authentication, authorization, historical observations, and real-time communication**.

Future development will focus on integrating **authorized UASS hardware/data sources** through the existing modular data-collection architecture.

---

# 📌 Project Highlights

- **MERN Stack**
- **MVC Backend Architecture**
- **Real-Time Monitoring**
- **Socket.IO Communication**
- **Telemetry Data Processing**
- **Interactive Data Visualization**
- **Role-Based Access Control**
- **JWT Authentication**
- **MongoDB**
- **Responsive Dashboard**
- **Simulated UASS Telemetry**
- **Modular Hardware Integration Architecture**
- **Security-Focused Design**

---

## 👨‍💻 Author
**Ranjit Sharma**

B.Tech Computer Science  
Trident Academy of Technology, Bhubaneswar
---



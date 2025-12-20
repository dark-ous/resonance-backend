# Resonance Backend

🔗 **Project:** https://resonancearc.netlify.app/

Backend service for the Resonance platform, providing APIs for authentication, threads, comments, and core data operations using Node.js, Express, Prisma, and PostgreSQL.

This repository contains the **server-side logic**, database layer, and API implementation.

---

## 🚀 Tech Stack

- **Node.js** – Runtime
- **Express.js** – HTTP server & routing
- **Prisma ORM** – Database access & schema management
- **PostgreSQL** – Primary database
- **JWT** – Authentication
- **JavaScript (ES6+)**

---

## 📂 Project Structure

```
resonance-backend/
├── prisma/
│ ├── schema.prisma # Database schema
│ └── migrations/ # Prisma migrations
│
├── src/
│ ├── routes/ # API routes
│ ├── controllers/ # Request handlers
│ ├── services/ # Business logic
│ ├── middleware/ # Auth & error handling
│ └── utils/ # Helpers
│
├── logger.js # Logging configuration
├── server.js # App entry point
├── package.json
└── .gitignore
```

---

## 🔑 Core Features

- User authentication using **JWT**
- Thread creation and commenting system
- Modular service-based architecture
- Prisma-powered database access
- Centralized logging
- Clean separation of concerns (routes → controllers → services)

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/resonance
JWT_SECRET=your_secret_key
PORT=5000

# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Start the server
node server.js


Server will run on:

http://localhost:5000

📡 API Overview (Example)
Method	Endpoint	Description
POST	/auth/register	Register new user
POST	/auth/login	Login user
GET	/threads	Fetch all threads
POST	/threads	Create a new thread
POST	/comments	Add comment to a thread

Detailed API docs can be added later using Swagger or Postman.
```

### 🛠 Development Notes

> Prisma handles schema consistency and migrations

> Business logic is isolated in the services layer

> Controllers remain thin and request-focused

> Logging is centralized for easier debugging

> Designed to be frontend-agnostic (web / mobile ready)

🚧 Planned Improvements

> Input validation (Zod / Joi)

> Rate limiting

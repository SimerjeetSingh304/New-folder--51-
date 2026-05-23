# DevTracker 🚀

A full-stack MERN application for developers to track **job applications**, **DSA problem-solving progress**, and **interview preparation** — all in one premium dashboard.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v4 |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| State | useContext + useReducer |
| HTTP Client | Axios + Interceptors |
| Charts | Recharts |

## Features

- 🔐 **JWT Authentication** — Register, login, stateless auth with 7-day token
- 💼 **Job Tracker** — Full CRUD with status, salary, location, notes; filter, search, sort
- 🧠 **DSA Log** — Track problems with topic, difficulty, platform, time; topic progress bars
- 📊 **Dashboard** — Recharts bar + pie charts, streak tracking, recent activity
- 🔔 **Toast Notifications** — Custom context, auto-dismiss in 3s
- 🌙 **Dark/Light Mode** — Persisted to localStorage
- 📱 **Mobile Responsive** — Hamburger nav, stacked layouts

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)

### 1. Clone & Navigate
```bash
git clone <your-repo-url>
cd devtracker
```

### 2. Setup Server
```bash
cd server
npm install
```

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/devtracker
JWT_SECRET=devtracker_secret_2024
NODE_ENV=development
```

### 3. Setup Client
```bash
cd ../client
npm install
```

The `client/.env` is already set:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run Both Servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open `http://localhost:5173`

## API Reference

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/me | Yes | Current user |
| GET | /api/jobs | Yes | All jobs |
| POST | /api/jobs | Yes | Create job |
| GET | /api/jobs/:id | Yes | Single job |
| PUT | /api/jobs/:id | Yes | Update job |
| DELETE | /api/jobs/:id | Yes | Delete job |
| GET | /api/problems | Yes | All problems |
| POST | /api/problems | Yes | Create problem |
| GET | /api/problems/:id | Yes | Single problem |
| PUT | /api/problems/:id | Yes | Update problem |
| DELETE | /api/problems/:id | Yes | Delete problem |
| GET | /api/stats | Yes | Dashboard stats |

## Deployment

| Part | Platform |
|---|---|
| Database | MongoDB Atlas (free) |
| Backend | Render (free) |
| Frontend | Vercel (free) |

## Skills Demonstrated

REST API Design · JWT Auth · MongoDB Aggregation · Mongoose Schemas · React Hooks · Context API · React Router v6 · Axios Interceptors · Express Middleware · Recharts · Debouncing

---

Built for MERN placement prep 🎯

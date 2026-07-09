# TowerNav & Chat

A multi-tenant SaaS application for modern commercial towers, corporate offices, and co-working spaces. It solves two problems: **indoor navigation** for new visitors/employees and **community engagement** within a physical building.

Built on the MERN stack: **MongoDB · Express.js · React (Vite) · Node.js**, with **Socket.io** for real-time chat.

## Features

- **Indoor Navigation** — searchable office directory with step-by-step wayfinding directions (e.g. *"Take the elevator to the 4th floor, turn left, Office 402 is next to the water cooler"*)
- **Real-Time Chat** — global tower chat and floor-specific lounges over Socket.io, with persisted history
- **Shuffle Chat** — random matchmaking that pairs two active users in the tower into a private chat room
- **Guest Access** — friction-free pseudonymous onboarding: pick a username, no password or email required
- **AI Assistant** — answers building questions from admin-managed FAQs, falling back to the office directory
- **Multi-Tenant SaaS** — full data isolation per building; every record is scoped to a tenant
- **Tenant Admin Dashboard** — manage the office directory, FAQs, SVG floor plans, and moderate reported chat messages
- **Super Admin Dashboard** — onboard buildings and manage their subscription status
- **Stripe Subscriptions** — Basic/Professional/Enterprise plans via Stripe Checkout + webhooks
- **SVG Floor Plans** — admins upload per-floor schematics, shown on the Navigation page
- **Profanity Filter** — server-side masking on every chat message
- **PWA** — installable app with a service worker (production builds)

## Project Structure

```
├── frontend/             # React frontend (Vite + Tailwind, PWA)
│   └── src/
│       ├── pages/        # Route pages (Login, Chat, Navigation, dashboards, ...)
│       ├── components/   # Shared UI components
│       ├── context/      # AuthContext (JWT session, role routing)
│       ├── lib/          # api.js (REST client) + socket.js (Socket.io client)
│       └── routes/       # AppRoutes with role-protected routes
├── backend/              # Node.js API (Express + Mongoose + Socket.io + Stripe)
│   └── src/
│       ├── models/       # Tenant, User, Office, ChatRoom, Message, Faq
│       ├── controllers/  # Route handlers (incl. billing + floor-map upload)
│       ├── routes/       # /api/v1/* routers
│       ├── sockets/      # Chat engine + random-match queue
│       └── seed.js       # Demo data (Apex Tower)
├── docs/                 # Scope document + deployment guide
└── docker-compose.yml    # One-command production stack (Mongo + API + frontend)
```

## Getting Started

**Prerequisites**: Node.js 18+, a running MongoDB (local or Atlas).

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env    # edit MONGODB_URI and JWT_SECRET
npm run seed              # seed demo building "Apex Tower"
npm run dev               # API on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev               # app on http://localhost:5173
```

The frontend talks to `http://localhost:5000` by default. Override with a `.env` file:

```
VITE_API_URL=https://your-api.example.com
VITE_TENANT_SLUG=apex-tower
```

## API & Real-Time Events

Full endpoint and Socket.io event reference: [backend/README.md](backend/README.md).

Highlights:
- `POST /api/v1/auth/guest` — pseudonymous onboarding
- `GET /api/v1/navigation/search?query=hr` — directory search
- `GET /api/v1/faqs/ask?question=...` — AI Assistant answers
- `socket.emit("random_match")` — join the Shuffle Chat queue

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — covers Docker Compose (single server),
Vercel + Render + MongoDB Atlas, and Stripe webhook setup.

## Roadmap

Per the [product scope document](<docs/TowerNav & Chat — Product Scope Document.md>):

- [x] Phase 1 — multi-tenant database, auth (super/tenant/user + guests), tenant admin directory management
- [x] Phase 2 — navigation search & wayfinding, Socket.io chat engine, random matching, responsive React frontend
- [x] Phase 3 — Stripe subscriptions, SVG floor-plan uploads, profanity filter, PWA, deployment packaging

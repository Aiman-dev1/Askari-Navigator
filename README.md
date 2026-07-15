# Askari Corporate Tower

A multi-tenant SaaS application for modern commercial towers, corporate offices, and co-working spaces, deployed for **Askari Corporate Tower** (Liberty Roundabout, Gulberg III, Lahore). It solves two problems: **indoor navigation** for new visitors/employees and **community engagement** within a physical building.

Built on the MERN stack: **MongoDB · Express.js · React (Vite) · Node.js**, with **Redux Toolkit** for state management, **Socket.io** for real-time chat, and **Stripe** for subscriptions.

## Features

### For visitors & tenants
- **Indoor Navigation** — searchable office directory with step-by-step wayfinding, a floor filter (Ground–Floor 13), and the tower's real floor-plan schematics rendered per result
- **Real-Time Chat ("Tenant Network")** — global lobby and floor-lounge boards over Socket.io with persisted history, live **typing indicators**, and a per-user **Clear conversation** option
- **Shuffle Chat** — random matchmaking that pairs two active users into a private chat room
- **Guest Access** — friction-free pseudonymous onboarding: pick a username, no password or email required (guests get navigation + concierge; the chat card is hidden for them)
- **AI Virtual Concierge** — floating chat widget on every page **including the public landing page**; answers from admin-managed FAQs with an office-directory fallback
- **Profile** — identity card with monogram, role badge, join date, and inline **username editing**

### For building admins
- **Admin Dashboard** — stat cards, office directory management, subscription & billing, chat moderation queue
- **Dedicated sub-pages** — Manage FAQs, Info Sheet, and Floor Map Schematics (SVG/PNG/JPG/WebP upload per floor), all linked from a role-aware navbar
- **Chat Moderation** — server-side profanity masking on every message, plus report/remove tooling

### Platform
- **Multi-Tenant SaaS** — full data isolation per building; every record is scoped to a tenant
- **Super Admin Dashboard** — onboard buildings, see each tenant's plan, and manage subscription status
- **Stripe Subscriptions** — Basic / Professional / Enterprise plans priced in **PKR**, via Stripe Checkout + webhooks (customer portal included)
- **PWA** — installable app with a service worker (production builds)

## Project Structure

```
├── frontend/             # React frontend (Vite + Tailwind, PWA)
│   └── src/
│       ├── pages/        # Route pages (Login, Chat, Navigation, admin pages, ...)
│       ├── components/   # Layout, dashboard cards, AI concierge widget
│       ├── store/        # Redux Toolkit store and slices (auth state, cross-tab sync)
│       ├── lib/          # api.js (REST client) + socket.js (Socket.io client)
│       └── routes/       # AppRoutes with role-protected routes
├── backend/              # Node.js API (Express + Mongoose + Socket.io + Stripe)
│   └── src/
│       ├── models/       # Tenant, User, Office, ChatRoom, Message, Faq
│       ├── controllers/  # Route handlers (auth, billing, floor-map upload, FAQ ask)
│       ├── routes/       # /api/v1/* routers
│       ├── sockets/      # Chat engine, typing events, random-match queue
│       ├── seed.js       # Demo data incl. real Askari floor plans
│       └── attach-floorplans.js  # npm run floorplans — re-attach schematics
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
npm run seed              # seed the demo building + floor plans + FAQs
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

### 3. Stripe (optional)

Billing endpoints return 503 until Stripe is configured. Set in `backend/.env`:
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and the three `STRIPE_PRICE_*` IDs
(create the Prices in **PKR** so Checkout matches the UI). For local webhooks run:

```bash
stripe listen --forward-to localhost:5000/api/v1/billing/webhook
```

Full walkthrough in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## API & Real-Time Events

Full endpoint and Socket.io event reference: [backend/README.md](backend/README.md).

Highlights:
- `POST /api/v1/auth/guest` — pseudonymous onboarding
- `PATCH /api/v1/auth/me` — change username (returns a fresh token)
- `GET /api/v1/navigation/search?query=hr` — directory search
- `GET /api/v1/faqs/ask?question=...&tenantSlug=...` — concierge answers (public)
- `POST /api/v1/tenants/mine/floors/:n/map` — upload a floor plan image
- `socket.emit("random_match")` — join the Shuffle Chat queue
- `socket.emit("typing" | "stop_typing", roomId)` — typing indicators

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — covers Docker Compose (single server),
Vercel + Render + MongoDB Atlas, and Stripe webhook setup.

## Roadmap

Per the [product scope document](<docs/TowerNav & Chat — Product Scope Document.md>):

- [x] Phase 1 — multi-tenant database, auth (super/tenant/user + guests), tenant admin directory management
- [x] Phase 2 — navigation search & wayfinding, Socket.io chat engine, random matching, responsive React frontend
- [x] Phase 3 — Stripe subscriptions (PKR), floor-plan uploads, profanity filter, PWA, deployment packaging
- [x] Post-launch polish — real Askari floor plans & FAQs, AI concierge widget, typing indicators, role-aware navigation, admin sub-pages, Redux state management migration

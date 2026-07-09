# TowerNav — Deployment Guide

Three ways to run TowerNav in production, from simplest to most control.

## Option A — Docker Compose (single server / VPS)

Everything (MongoDB, API, frontend) on one machine.

```bash
# In the repo root, create a .env for compose:
#   JWT_SECRET=<long random string>
#   CLIENT_URL=http://your-server:8080        (or your domain)
#   VITE_API_URL=http://your-server:5000      (or your API domain)
docker compose up -d --build

# Seed demo data (first run only)
docker compose exec backend node src/seed.js
```

- Frontend: http://localhost:8080 · API: http://localhost:5000
- Uploaded floor plans persist in the `uploads` volume; Mongo data in `mongo-data`.

## Option B — Vercel (frontend) + Render (backend) + MongoDB Atlas

**1. MongoDB Atlas** — create a free M0 cluster, a database user, and allow access
from anywhere (or Render's IPs). Copy the connection string.

**2. Render (backend)** — create a *Web Service* from this repo:
- Root directory: `backend` · Build: `npm install` · Start: `npm start`
- Environment variables:

| Key | Value |
| --- | --- |
| `MONGODB_URI` | your Atlas connection string |
| `JWT_SECRET` | long random string |
| `CLIENT_URL` | your Vercel URL (e.g. `https://towernav.vercel.app`) |
| `STRIPE_*` | see Stripe section below (optional) |

Seed once from Render's shell: `node src/seed.js`.

> Render's free-tier disk is ephemeral — uploaded floor plans are lost on redeploy.
> Attach a persistent disk mounted at `/opt/render/project/src/backend/uploads`,
> or move uploads to S3/Cloudinary later.

**3. Vercel (frontend)** — import the repo:
- Root directory: `frontend` · Framework preset: Vite
- Environment variables: `VITE_API_URL=https://<your-render-service>.onrender.com`,
  `VITE_TENANT_SLUG=apex-tower`

Socket.io works over Render out of the box (WebSocket falls back to polling if needed).

## Option C — Any Node host

The backend is a plain Node app: set the env vars from `backend/.env.example`,
run `node src/server.js` behind a reverse proxy (nginx/Caddy) that forwards
`/socket.io` with WebSocket upgrade headers. Serve `frontend/dist` (from
`npm run build`) as static files.

## Stripe setup (all options)

1. In the Stripe Dashboard create three recurring **Prices** in **PKR**
   (currency matters — the UI displays PKR, so the Checkout charge should too;
   amounts are set in `backend/src/config/plans.js`) and copy their `price_...`
   IDs into `STRIPE_PRICE_BASIC` / `STRIPE_PRICE_PROFESSIONAL` /
   `STRIPE_PRICE_ENTERPRISE`.
2. Set `STRIPE_SECRET_KEY` (use test keys first: `sk_test_...`).
3. Add a webhook endpoint pointing to
   `https://<your-api-domain>/api/v1/billing/webhook` with events
   `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`; copy its signing secret into
   `STRIPE_WEBHOOK_SECRET`.
4. Local testing: `stripe listen --forward-to localhost:5000/api/v1/billing/webhook`.

Until these are set, the billing UI shows plans but checkout returns
"Billing is not configured yet" — everything else works normally.

## PWA

The frontend ships a web app manifest and service worker (vite-plugin-pwa) in
production builds — visitors can install it from the browser menu. API, socket,
and upload traffic are never cached; Google Fonts are cached for offline reuse.

## Production checklist

- [ ] Strong unique `JWT_SECRET`
- [ ] `CLIENT_URL` set to the exact frontend origin (CORS + Stripe redirects)
- [ ] MongoDB with authentication (Atlas or `--auth`)
- [ ] HTTPS on both frontend and API (Vercel/Render provide this automatically)
- [ ] Stripe live keys + live webhook secret when going live
- [ ] Persistent storage for `backend/uploads`

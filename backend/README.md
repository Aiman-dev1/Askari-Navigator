# TowerNav Backend

Node.js / Express / MongoDB / Socket.io API for TowerNav & Chat (multi-tenant SaaS).

## Setup

```bash
cd backend
npm install
copy .env.example .env   # then edit values (MONGODB_URI, JWT_SECRET)
npm run seed             # seed demo data (Apex Tower)
npm run dev              # start with auto-reload on http://localhost:5000
```

Requires a running MongoDB (local `mongod` or a MongoDB Atlas URI in `MONGODB_URI`).

## Seeded accounts

| Role         | Email               | Password | Tenant     |
| ------------ | ------------------- | -------- | ---------- |
| Super admin  | super@towernav.com  | super123 | —          |
| Tenant admin | admin@apextower.com | admin123 | apex-tower |

Guests need no password: `POST /api/v1/auth/guest { username, tenantSlug: "apex-tower" }`.

## REST API (all under `/api/v1`)

Auth: `Authorization: Bearer <token>` (token returned by register/login/guest).

| Method | Route                          | Access       | Purpose                              |
| ------ | ------------------------------ | ------------ | ------------------------------------ |
| POST   | /auth/register                 | public       | Register user in a building          |
| POST   | /auth/login                    | public       | Email + password login               |
| POST   | /auth/guest                    | public       | Pseudonymous guest onboarding        |
| GET    | /auth/me                       | any          | Current user                         |
| GET    | /navigation/search?query=hr    | any          | Search building directory            |
| GET    | /navigation/directions/:id     | any          | Step-by-step wayfinding              |
| GET    | /offices                       | any          | Full directory                       |
| POST   | /offices                       | tenant admin | Add directory entry                  |
| PUT    | /offices/:id                   | tenant admin | Update entry                         |
| DELETE | /offices/:id                   | tenant admin | Delete entry                         |
| GET    | /tenants/slug/:slug            | public       | Building info for onboarding         |
| GET    | /tenants/mine                  | tenant admin | Own building                         |
| PUT    | /tenants/mine/floors           | tenant admin | Upload/replace floor plans (SVG URL) |
| GET    | /tenants                       | super admin  | All buildings                        |
| POST   | /tenants                       | super admin  | Onboard building (+ admin account)   |
| PATCH  | /tenants/:id                   | super admin  | Update subscription status etc.      |
| GET    | /faqs                          | any          | Building FAQs                        |
| GET    | /faqs/ask?question=...         | any          | Answer a question (FAQ + directory)  |
| POST   | /faqs                          | tenant admin | Add FAQ                              |
| PUT    | /faqs/:id                      | tenant admin | Update FAQ                           |
| DELETE | /faqs/:id                      | tenant admin | Delete FAQ                           |
| GET    | /chat/rooms                    | any          | Rooms in own building                |
| GET    | /chat/rooms/:id/messages       | any          | Message history (paginated)          |
| POST   | /chat/messages/:id/report      | any          | Report a message                     |
| GET    | /chat/reported                 | tenant admin | Moderation queue                     |
| DELETE | /chat/messages/:id             | tenant admin | Remove a message                     |

## Socket.io events

Connect with the JWT: `io(URL, { auth: { token } })`.

Client → server:
- `join_room(roomId, ack)` / `leave_room(roomId)`
- `send_message({ roomId, message }, ack)`
- `random_match(ack)` — Shuffle Chat queue; `cancel_match(ack)` to leave the queue

Server → client:
- `new_message` — `{ id, roomId, sender, senderId, message, createdAt }`
- `user_joined` / `user_left` — `{ username, roomId }`
- `match_found` — `{ roomId, roomName, partner }`

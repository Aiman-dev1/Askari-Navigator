TowerNav & Chat (SaaS) — Product Scope Document

1\. Executive Summary

TowerNav & Chat is a multi-tenant SaaS application designed for modern commercial towers, corporate offices, and co-working spaces. It solves two major problems: indoor navigation for new visitors/employees and community engagement within a physical building.

Technology Stack  
\- MongoDB: Flexible document storage for tenant data, user profiles, and chat logs.  
\- Express.js & Node.js: Scalable REST API gateway and WebSocket management.  
\- React.js: Dynamic, responsive front-end for both the user application and the Tenant Admin Dashboard.  
\- Socket.io: Real-time bi-directional communication for the chat engine.

2\. Core Features & System Architecture

A. Multi-Tenant SaaS Structure

Because this is a SaaS product, the database must support multi-tenancy (data isolation per building/client).

\- Super Admin Portal: To manage corporate client subscriptions, billing, and global app settings.  
\- Tenant Admin Dashboard: Allows building managers to upload floor plans, map office locations, and moderate chat rooms.

B. Indoor Navigation Module

\- Directory Listing: Searchable list of offices, departments, utilities (restrooms, cafeterias), and conference rooms.  
\- Floor-by-Floor Mapping: Visual representation of tower floors.  
\- Wayfinding: Step-by-step text/visual directions (e.g., "Take the elevator to the 4th floor, turn left, Office 402 is next to the water cooler").

Note for Phase 1: True GPS doesn't work well indoors. For the MVP, we will use interactive SVG floor plans or digital directory nodes rather than full blue-dot GPS navigation.

C. Anonymous/Pseudonymous Real-Time Chat

\- Profile Setup: Quick, friction-free onboarding. Users enter the app and choose a temporary or permanent username (no heavy OAuth required unless enforced by the tenant).  
\- Location-Bound Chatrooms: Global tower chat or floor-specific channels (e.g., "3rd Floor Lounge").  
\- Random Chat / Matchmaking: A "Shuffle Chat" feature that pairs the user with another active user currently in the tower for networking.

3\. Detailed Technical Requirements (MERN Stack)

Database Schema (MongoDB Examples)

// Tenant (The Building)  
{  
  tenantId: ObjectId,  
  buildingName: "Apex Tower",  
  subscriptionStatus: "Active",  
  floors: \[{ floorNumber: 1, mapUrl: "svg\_link" }\]  
}

// User Profile  
{  
  userId: ObjectId,  
  tenantId: ObjectId,  
  username: "ShadowWalker42",  
  isGuest: true,  
  createdAt: Timestamp  
}

API & Real-Time Endpoints (Node.js/Express & Socket.io)

\- GET /api/v1/navigation/search?query=hr — Fetches office location details.  
\- socket.on("join\_room") — Handles users entering specific floor chats.  
\- socket.on("random\_match") — Node.js backend maintains a queue of users looking to chat and pairs them instantly using a basic matching algorithm.

4\. Project Roadmap & Phases

Phase 1: Foundation (Weeks 1–4)  
\- Database architecture  
\- Super/Tenant Auth  
\- Basic UI skeleton  
\- Setup MongoDB multi-tenant indexing  
\- Build the Tenant Admin UI to allow manual input of office directories

Phase 2: Navigation & Chat (Weeks 5–8)  
\- SVG map integration  
\- Socket.io chat engine  
\- Random matching algorithm  
\- Build the mobile-responsive React front-end  
\- Implement Socket.io server for instant messaging and the matching queue

Phase 3: SaaS & Launch (Weeks 9–12)  
\- Subscription/Stripe setup  
\- Deployment (AWS/Heroku/Vercel)  
\- QA & Beta Testing  
\- Integrate Stripe for SaaS subscriptions  
\- Add chat moderation features (profanity filters, report user button) to protect tenant reputation

5\. Out of Scope (Future Revisions)

\- Native Mobile Apps: The MVP will be a Progressive Web App (PWA) to avoid App Store friction for temporary visitors.  
\- Hardware Integration: Wi-Fi trilateration or Bluetooth Beacons for automated step-by-step tracking are pushed to Version 2.0.  

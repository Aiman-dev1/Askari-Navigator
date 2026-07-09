import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import navigationRoutes from "./routes/navigation.js";
import officeRoutes from "./routes/offices.js";
import tenantRoutes from "./routes/tenants.js";
import chatRoutes from "./routes/chat.js";
import faqRoutes from "./routes/faqs.js";
import billingRoutes from "./routes/billing.js";
import { webhook } from "./controllers/billingController.js";
import { UPLOADS_DIR } from "./middleware/upload.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Stripe webhook must see the raw body for signature verification,
// so it is mounted before express.json()
app.post("/api/v1/billing/webhook", express.raw({ type: "application/json" }), webhook);

app.use(express.json());
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.get("/api/v1/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/navigation", navigationRoutes);
app.use("/api/v1/offices", officeRoutes);
app.use("/api/v1/tenants", tenantRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/faqs", faqRoutes);
app.use("/api/v1/billing", billingRoutes);

// Uploaded floor plans. The CSP header stops any scripts inside an
// uploaded SVG from running if the file is opened directly.
app.use(
  "/uploads",
  express.static(UPLOADS_DIR, {
    setHeaders: (res) => {
      res.setHeader("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'");
      res.setHeader("X-Content-Type-Options", "nosniff");
    },
  })
);

app.use(notFound);
app.use(errorHandler);

export default app;

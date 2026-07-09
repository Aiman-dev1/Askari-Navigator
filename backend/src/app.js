import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import navigationRoutes from "./routes/navigation.js";
import officeRoutes from "./routes/offices.js";
import tenantRoutes from "./routes/tenants.js";
import chatRoutes from "./routes/chat.js";
import faqRoutes from "./routes/faqs.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.get("/api/v1/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/navigation", navigationRoutes);
app.use("/api/v1/offices", officeRoutes);
app.use("/api/v1/tenants", tenantRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/faqs", faqRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";

export const app = express();

import userRoutes from "./routes/cashflow/user-routes";
import paymentRoutes from "./routes/cashflow/payment-routes";

// Apply middleware first
app.use(express.json());
app.use(cookieParser());
app.use(compression());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cash-flow-crew.vercel.app",
      "https://cashflowcrew.in",
      "https://api-preprod.phonepe.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Routes
// user
app.use("/api/v1/users", userRoutes);

// payment
app.use("/api/v1/payments", paymentRoutes);

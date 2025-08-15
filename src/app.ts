import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
import cors from "cors";

export const app = express();
import cookieParser from "cookie-parser";
import compression from "compression";
import userRoutes from "./routes/cashflow/user-routes";
import paymentRoutes from "./routes/cashflow/payment-routes";
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Apply middleware first
app.use(express.json());
app.use(cookieParser());
app.use(compression());

//Cors setupa
app.use(
  cors({
    origin: ["http://localhost:5173", "https://cash-flow-crew.vercel.app","https://cashflowcrew.in","https://api-preprod.phonepe.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
//  write for only for / for 

// app.use("/", (req, res) => {
//   res.send("Welcome to the Cash Flow Crew API");
// });

// User routes
app.use("/api/v1/users", userRoutes);
// payment routes
app.use("/api/v1/payments", paymentRoutes);

import dotenv from "dotenv";
dotenv.config();
import { app } from "./app";
import { connectDB } from "./config/cashflow/dbConnect";

// Handle unexpected exceptions
process.on("uncaughtException", (err) => {
  console.error(err.name, err.message);
  console.error("Uncaught Exception occurred! Shutting down...");
  process.exit(1);
});

(async () => {
  await connectDB();
})();

export default app; // ✅ Required for Vercel serverless

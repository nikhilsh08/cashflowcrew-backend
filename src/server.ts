import dotenv from "dotenv"
dotenv.config({ path: "./.env" });
import {app} from "./app";
import { dbConnect } from "./config/cashflow/dbConnect";

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception occured! Shutting down...");
  process.exit(1);
});
dbConnect();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `server has started... on PORT ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});
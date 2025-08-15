"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./.env" });
const app_1 = require("./app");
const dbConnect_1 = require("./config/cashflow/dbConnect");
process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    console.log("Uncaught Exception occured! Shutting down...");
    process.exit(1);
});
(0, dbConnect_1.dbConnect)();
const index = app_1.app.listen(process.env.PORT, () => {
    console.log(`index has started... on PORT ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});
//# sourceMappingURL=index.js.map
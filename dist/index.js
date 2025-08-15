"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = require("./app");
const dbConnect_1 = require("./config/cashflow/dbConnect");
// Handle unexpected exceptions
process.on("uncaughtException", (err) => {
    console.error(err.name, err.message);
    console.error("Uncaught Exception occurred! Shutting down...");
    process.exit(1);
});
(async () => {
    await (0, dbConnect_1.connectDB)();
})();
exports.default = app_1.app; // ✅ Required for Vercel serverless
//# sourceMappingURL=index.js.map
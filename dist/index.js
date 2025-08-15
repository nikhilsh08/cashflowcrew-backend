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
    try {
        await (0, dbConnect_1.connectDB)();
        const PORT = process.env.PORT || 3000;
        app_1.app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error("Failed to connect to database:", err);
        process.exit(1);
    }
})();
//# sourceMappingURL=index.js.map
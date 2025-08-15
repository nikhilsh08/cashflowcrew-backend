"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./.env" });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
exports.app = (0, express_1.default)();
const user_routes_1 = __importDefault(require("./routes/cashflow/user-routes"));
const payment_routes_1 = __importDefault(require("./routes/cashflow/payment-routes"));
// Apply middleware first
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, compression_1.default)());
exports.app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://cash-flow-crew.vercel.app",
        "https://cashflowcrew.in",
        "https://api-preprod.phonepe.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));
// Routes
// user
exports.app.use("/api/v1/users", user_routes_1.default);
// payment
exports.app.use("/api/v1/payments", payment_routes_1.default);
//# sourceMappingURL=app.js.map
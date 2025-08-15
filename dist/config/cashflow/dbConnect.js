"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './.env' });
const dbConnect = () => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error("DATABASE_URL environment variable is not defined.");
    }
    mongoose_1.default.connect(databaseUrl, {}).then(() => {
        console.log("Database connected");
    }).catch((error) => {
        console.log("databse connection failed....", error);
    });
    const db = mongoose_1.default.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
        console.log(`Database connected `);
    });
};
exports.dbConnect = dbConnect;
//# sourceMappingURL=dbConnect.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const masterclassSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    date: { type: Date, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    currency: { type: String, required: true },
}, { timestamps: true });
const Masterclass = mongoose_1.default.model("Masterclass", masterclassSchema);
exports.default = Masterclass;
//# sourceMappingURL=Masterclass.js.map
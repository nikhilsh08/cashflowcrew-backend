"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    redeemedCoupon: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Coupon",
    },
    totalSessionAttended: {
        type: Number,
        default: 0,
    },
    orderId: {
        type: String,
        unique: true,
    },
    transaction: {
        type: Boolean,
        default: false
    },
    EventTime: {
        type: Date
    },
    Event: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Masterclass"
    },
    Value: {
        type: Number
    },
    Currency: {
        type: String
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, { timestamps: true });
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=Users.js.map
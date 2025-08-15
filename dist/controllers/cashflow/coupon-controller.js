"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyCoupon = exports.createCoupon = void 0;
const Coupon_1 = __importDefault(require("../../model/Coupon"));
const Users_1 = __importDefault(require("../../model/Users"));
const createCoupon = async (req, res) => {
    const { code, discount, expiryDate } = req.body;
    if (!code || !discount || !expiryDate) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }
    try {
        const newCoupon = new Coupon_1.default({
            code,
            discount,
            expiryDate
        });
        await newCoupon.save();
        res.status(201).json({
            message: "Coupon created successfully",
            coupon: newCoupon
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error creating coupon",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.createCoupon = createCoupon;
const applyCoupon = async (req, res) => {
    const { userId, couponId } = req.body;
    if (!userId || !couponId) {
        return res.status(400).json({
            message: "User ID and Coupon ID are required"
        });
    }
    try {
        const user = await Users_1.default.findById(userId);
        const coupon = await Coupon_1.default.findById(couponId);
        if (!user || !coupon) {
            return res.status(404).json({
                message: "User or Coupon not found"
            });
        }
        if (user.redeemedCoupon === coupon._id) {
            return res.status(400).json({
                message: "User has already redeemed a coupon"
            });
        }
        user.redeemedCoupon = coupon._id;
        await user.save();
        res.status(200).json({
            message: "Coupon applied successfully",
            user
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error applying coupon",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.applyCoupon = applyCoupon;
//# sourceMappingURL=coupon-controller.js.map
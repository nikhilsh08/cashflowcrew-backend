"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.userRegister = exports.userRegisteration = void 0;
const Users_1 = __importDefault(require("../../model/Users"));
const Coupon_1 = __importDefault(require("../../model/Coupon"));
const userRegisteration = async (req, res) => {
    const { firstName, lastName, email, phone, coupon } = req.body;
    if (!firstName || !lastName || !email || !phone) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }
    try {
        const getCoupon = await Coupon_1.default.findOne({ code: coupon });
        const checkAlreadyRedeemed = await Users_1.default.findOne({ redeemedCoupon: getCoupon?._id });
        if (checkAlreadyRedeemed) {
            return res.status(400).json({
                message: "Coupon has already been redeemed"
            });
        }
        const userAlreadyRegistered = await Users_1.default.findOne({ email });
        if (userAlreadyRegistered) {
            return res.status(400).json({
                message: "User is already registered"
            });
        }
        const newUser = new Users_1.default({
            firstName,
            lastName,
            email,
            phone,
            redeemedCoupon: coupon
        });
        await newUser.save();
        res.status(201).json({
            message: "User registered successfully",
            user: newUser
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error registering user",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.userRegisteration = userRegisteration;
const userRegister = async ({ firstName, lastName, email, phone, coupon, }) => {
    if (!firstName || !lastName || !email || !phone) {
        throw new Error("All fields are required");
    }
    const userAlreadyRegistered = await Users_1.default.findOne({ email });
    if (userAlreadyRegistered) {
        return userAlreadyRegistered;
    }
    const newUser = new Users_1.default({
        firstName,
        lastName,
        email,
        phone,
    });
    await newUser.save();
    return newUser;
};
exports.userRegister = userRegister;
const updateUser = async (req, res) => {
    const { id } = req.params;
    console.log("id.....", id);
    const update = req.body;
    try {
        const updatedUser = await Users_1.default.findOneAndUpdate({ orderId: id }, update, { new: true });
        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error updating user",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.updateUser = updateUser;
//# sourceMappingURL=user-controller.js.map
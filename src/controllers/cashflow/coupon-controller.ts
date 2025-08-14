import Coupon from "../../model/Coupon";
import { Request,Response } from "express";
import User from "../../model/Users";

export const createCoupon = async (req: Request, res: Response) => {
    const { code, discount, expiryDate } = req.body;

    if (!code || !discount || !expiryDate) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {
        const newCoupon = new Coupon({
            code,
            discount,
            expiryDate
        });

        await newCoupon.save();

        res.status(201).json({
            message: "Coupon created successfully",
            coupon: newCoupon
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating coupon",
            error: error.message
        });
    }
};

export const applyCoupon = async (req: Request, res: Response) => {
    const { userId, couponId } = req.body;

    if (!userId || !couponId) {
        return res.status(400).json({
            message: "User ID and Coupon ID are required"
        });
    }

    try {
        const user = await User.findById(userId);
        const coupon = await Coupon.findById(couponId);

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
    } catch (error) {
        res.status(500).json({
            message: "Error applying coupon",
            error: error.message
        });
    }
}

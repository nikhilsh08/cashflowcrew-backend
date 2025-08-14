import User from "../../model/Users";
import { Request, Response } from "express";
import Coupon from "../../model/Coupon";
import mongoose from "mongoose";

export const userRegisteration  = async (req:Request,res:Response,) =>{
    const { firstName, lastName, email, phone,coupon } = req.body;
    if (!firstName || !lastName || !email || !phone) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }
    try {
        const getCoupon = await Coupon.findOne({ code: coupon });
        const checkAlreadyRedeemed = await User.findOne({ redeemedCoupon: getCoupon?._id });
        if (checkAlreadyRedeemed) {
            return res.status(400).json({
                message: "Coupon has already been redeemed"
            });
        }
        const userAlreadyRegistered = await User.findOne({ email });
        if (userAlreadyRegistered) {
            return res.status(400).json({
                message: "User is already registered"
            });
        }
        const newUser = new User({
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
    } catch (error) {
        res.status(500).json({
            message: "Error registering user",
            error: error instanceof Error ? error.message : String(error)
        });
    }

}

export const userRegister = async ({
  firstName,
  lastName,
  email,
  phone,
  coupon,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coupon?: string;
}) => {
  if (!firstName || !lastName || !email || !phone) {
    throw new Error("All fields are required");
  }
  const userAlreadyRegistered = await User.findOne({ email });
  if (userAlreadyRegistered) {
    return userAlreadyRegistered;
  }
  const newUser = new User({
    firstName,
    lastName,
    email,
    phone,
});

  await newUser.save();
  return newUser;
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log("id.....", id);
    const update = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate({ orderId: id }, update, { new: true });

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating user",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

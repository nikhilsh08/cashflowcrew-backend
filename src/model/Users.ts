import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
      type: mongoose.Schema.Types.ObjectId,
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
    transaction:{
      type:Boolean,
      default:false
    },
    EventTime: {
      type: Date
    },
    Event: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

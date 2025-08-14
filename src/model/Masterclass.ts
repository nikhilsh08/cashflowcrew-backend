import mongoose from "mongoose";

const masterclassSchema = new mongoose.Schema({
    email: { type: String, required: true,unique: true },
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

const Masterclass = mongoose.model("Masterclass", masterclassSchema);

export default Masterclass;

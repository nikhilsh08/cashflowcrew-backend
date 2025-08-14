import Masterclass from "../../model/Masterclass";

import { Request, Response } from "express";

export const createMasterclass = async (req: Request, res: Response) => {
  try {
    const { email, title, description, instructor, date, start_time, end_time, duration, price, location, currency } = req.body;

    const masterclass = new Masterclass({
      email,
      title,
      description,
      instructor,
      date,
      start_time,
      end_time,
      duration,
      price,
      location,
      currency
    });

    await masterclass.save();
    res.status(201).json({ success: true, data: masterclass });
  } catch (error) {
    console.error("Error creating masterclass:", error);
    res.status(500).json({ success: false, message: "Failed to create masterclass" });
  }
};

export const getMasterclasses = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const masterclasses = await Masterclass.findById(id);
    res.status(200).json({ success: true, data: masterclasses });
  } catch (error) {
    console.error("Error fetching masterclasses:", error);
    res.status(500).json({ success: false, message: "Failed to fetch masterclasses" });
  }
};

export const updateMasterclass = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const masterclass = await Masterclass.findByIdAndUpdate(id, updates, { new: true });
        if (!masterclass) {
            return res.status(404).json({ success: false, message: "Masterclass not found" });
        }

        res.status(200).json({ success: true, data: masterclass });
    } catch (error) {
        console.error("Error updating masterclass:", error);
        res.status(500).json({ success: false, message: "Failed to update masterclass" });
    }
};
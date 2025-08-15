"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMasterclass = exports.getMasterclasses = exports.createMasterclass = void 0;
const Masterclass_1 = __importDefault(require("../../model/Masterclass"));
const createMasterclass = async (req, res) => {
    try {
        const { email, title, description, instructor, date, start_time, end_time, duration, price, location, currency } = req.body;
        const masterclass = new Masterclass_1.default({
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
    }
    catch (error) {
        console.error("Error creating masterclass:", error);
        res.status(500).json({ success: false, message: "Failed to create masterclass" });
    }
};
exports.createMasterclass = createMasterclass;
const getMasterclasses = async (req, res) => {
    try {
        const { id } = req.params;
        const masterclasses = await Masterclass_1.default.findById(id);
        res.status(200).json({ success: true, data: masterclasses });
    }
    catch (error) {
        console.error("Error fetching masterclasses:", error);
        res.status(500).json({ success: false, message: "Failed to fetch masterclasses" });
    }
};
exports.getMasterclasses = getMasterclasses;
const updateMasterclass = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const masterclass = await Masterclass_1.default.findByIdAndUpdate(id, updates, { new: true });
        if (!masterclass) {
            return res.status(404).json({ success: false, message: "Masterclass not found" });
        }
        res.status(200).json({ success: true, data: masterclass });
    }
    catch (error) {
        console.error("Error updating masterclass:", error);
        res.status(500).json({ success: false, message: "Failed to update masterclass" });
    }
};
exports.updateMasterclass = updateMasterclass;
//# sourceMappingURL=masterclass-controllor.js.map
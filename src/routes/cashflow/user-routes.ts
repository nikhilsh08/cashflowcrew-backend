import express from "express";
import { userRegisteration,updateUser } from "../../controllers/cashflow/user-controller";

const router = express.Router();

router.post("/register", userRegisteration);
router.put("/update/:id", updateUser);

export default router;

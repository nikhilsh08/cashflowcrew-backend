import express from "express";
import { userRegisteration,updateUser,getUserById } from "../../controllers/cashflow/user-controller";

const router = express.Router();

router.post("/register", userRegisteration);
router.put("/update/:id", updateUser);
router.get("/:id", getUserById);


export default router;

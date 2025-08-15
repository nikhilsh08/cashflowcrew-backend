"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../../controllers/cashflow/user-controller");
const router = express_1.default.Router();
router.post("/register", user_controller_1.userRegisteration);
router.put("/update/:id", user_controller_1.updateUser);
router.get("/:id", user_controller_1.getUserById);
exports.default = router;
//# sourceMappingURL=user-routes.js.map
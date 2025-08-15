"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("../../controllers//cashflow/payment-controller");
const router = express_1.default.Router();
router.post('/initiate', payment_controller_1.initiateCheckout);
router.post('/create-sdk-order', payment_controller_1.createSdkOrder);
router.post('/initiate-v2', payment_controller_1.initiateCheckoutv2);
router.get('/status/:orderId', payment_controller_1.checkPaymentStatus);
router.post('/callback', express_1.default.json(), payment_controller_1.handleCallback);
router.get('/status-v2/:orderId', payment_controller_1.checkPaymentStatusv2);
exports.default = router;
//# sourceMappingURL=payment-routes.js.map
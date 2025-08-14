import express from "express"
import { initiateCheckout,checkPaymentStatus,createSdkOrder,handleCallback,initiateCheckoutv2,checkPaymentStatusv2 } from "../../controllers//cashflow/payment-controller";

const router = express.Router();

router.post('/initiate', initiateCheckout);
router.post('/create-sdk-order', createSdkOrder);
router.post('/initiate-v2', initiateCheckoutv2);
router.get('/status/:orderId', checkPaymentStatus);
router.post('/callback', express.json(), handleCallback);
router.get('/status-v2/:orderId', checkPaymentStatusv2);

export default router;

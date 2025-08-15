"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPaymentStatusv2 = exports.initiateCheckoutv2 = exports.handleCallback = exports.checkPaymentStatus = exports.createSdkOrder = exports.initiateCheckout = void 0;
const uuid_1 = require("uuid");
const phonePeInitialize_1 = __importDefault(require("../../utils/phonePeInitialize"));
const pg_sdk_node_1 = require("pg-sdk-node");
const axios_1 = __importDefault(require("axios"));
const user_controller_1 = require("./user-controller");
const crypto_1 = __importDefault(require("crypto"));
const phonepeAuthorizaiton_1 = require("../../utils/phonepeAuthorizaiton");
const Users_1 = __importDefault(require("../../model/Users"));
const transaction_controllor_1 = require("./transaction-controllor");
// Initiate Standard Checkout
const initiateCheckout = async (req, res) => {
    try {
        const { amount, firstName, lastName, email, phone, coupon } = req.body;
        console.log("amount....", amount);
        if (!amount || amount <= 0)
            return res.status(400).json({ error: 'Invalid amount' });
        const merchantOrderId = `ORDER_${(0, uuid_1.v4)()}`;
        const redirectUrl = `${process.env.PHONEPE_REDIRECT_URL}/payment/status/${merchantOrderId}`;
        const user = await (0, user_controller_1.userRegister)({ firstName, lastName, email, phone, coupon });
        const request = pg_sdk_node_1.StandardCheckoutPayRequest.builder()
            .merchantOrderId(merchantOrderId)
            .amount(Math.round(amount * 100))
            .redirectUrl(redirectUrl)
            .build();
        const response = await phonePeInitialize_1.default.getClient().pay(request);
        await Users_1.default.findByIdAndUpdate(user._id, { orderId: merchantOrderId });
        console.log("Payment Response:", response, merchantOrderId);
        res.json({ success: true, checkoutUrl: response.redirectUrl, orderId: merchantOrderId, email: user.email });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Payment initiation failed', details: err.message });
    }
};
exports.initiateCheckout = initiateCheckout;
// Create SDK Order
const createSdkOrder = async (req, res) => {
    try {
        const { amount, firstName, lastName, email, phone, coupon } = req.body;
        if (!amount || amount <= 0)
            return res.status(400).json({ error: 'Invalid amount' });
        const merchantOrderId = `ORDER_${(0, uuid_1.v4)()}`;
        const redirectUrl = `${process.env.PHONEPE_REDIRECT_URL}/payment/status/${merchantOrderId}`;
        const user = await (0, user_controller_1.userRegister)({ firstName, lastName, email, phone, coupon });
        const request = pg_sdk_node_1.CreateSdkOrderRequest.StandardCheckoutBuilder()
            .merchantOrderId(merchantOrderId)
            .amount(Math.round(amount * 100))
            .redirectUrl(redirectUrl)
            .build();
        const response = await phonePeInitialize_1.default.getClient().createSdkOrder(request);
        res.json({ success: true, token: response.token, orderId: merchantOrderId });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Order creation failed', details: err.message });
    }
};
exports.createSdkOrder = createSdkOrder;
// Check Payment Status
const checkPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!orderId)
            return res.status(400).json({ error: "Order ID required" });
        const response = await phonePeInitialize_1.default.getClient().getOrderStatus(orderId);
        const getUser = await Users_1.default.findOne({ orderId });
        let transactionData;
        console.log("user details....:", getUser);
        if (getUser) {
            const mappedData = (0, transaction_controllor_1.mapPhonePeToTransaction)(response, getUser._id, orderId);
            // Ensure orderId is always a string
            if (typeof mappedData.orderId !== 'string' || !mappedData.orderId) {
                mappedData.orderId = orderId;
            }
            transactionData = await (0, transaction_controllor_1.createTransaction)(mappedData, getUser._id);
        }
        console.log("Transaction Data:", transactionData);
        res.json({ success: true, status: response.state, data: response });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Status check failed", details: err.message });
    }
};
exports.checkPaymentStatus = checkPaymentStatus;
// Handle Callback
const handleCallback = async (req, res) => {
    try {
        const authHeader = req.header('authorization') || '';
        const bodyStr = JSON.stringify(req.body);
        const isValid = await phonePeInitialize_1.default.getClient().validateCallback(process.env.MERCHANT_USERNAME, process.env.MERCHANT_PASSWORD, authHeader, bodyStr);
        if (!isValid)
            return res.status(401).json({ error: 'Invalid callback' });
        const { type, payload } = req.body;
        const { merchantOrderId, state } = payload;
        // Handle based on type (PAYMENT_SUCCESS, PAYMENT_ERROR...)
        console.log(`Callback for order ${merchantOrderId}: status ${state}`);
        res.status(200).send('OK');
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Callback processing failed', details: err.message });
    }
};
exports.handleCallback = handleCallback;
const initiateCheckoutv2 = async (req, res) => {
    try {
        const { amount, firstName, lastName, email, phone, coupon } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }
        const merchantOrderId = `ORDER_${(0, uuid_1.v4)()}`;
        const redirectUrl = `${process.env.PHONEPE_REDIRECT_URL}/payment/status/${merchantOrderId}`;
        const amountInPaise = Math.round(amount * 100);
        const authResponse = await (0, phonepeAuthorizaiton_1.phonePeAuthorizations)();
        console.log("authResponse", authResponse);
        const payload = {
            merchantId: process.env.PHONEPE_MERCHANT_ID,
            merchantOrderId: merchantOrderId,
            amount: amountInPaise,
            expireAfter: 1200,
            paymentFlow: {
                type: "PG_CHECKOUT",
                merchantUrls: {
                    redirectUrl,
                },
            },
        };
        const jsonPayload = JSON.stringify(payload);
        console.log("jsonPayload", jsonPayload);
        const base64Payload = Buffer.from(jsonPayload).toString("base64");
        console.log("base64Payload", base64Payload);
        const sha256 = crypto_1.default
            .createHash("sha256")
            .update(base64Payload + "/pg/v1/pay" + process.env.PHONEPE_SALT_KEY)
            .digest("hex");
        const xVerify = `${sha256}###${process.env.PHONEPE_SALT_INDEX}`;
        const options = {
            method: "POST",
            url: "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay",
            headers: {
                "Content-Type": "application/json",
                "X-VERIFY": xVerify,
                "X-MERCHANT-ID": process.env.PHONEPE_MERCHANT_ID,
                "Authorization": `O-Bearer ${authResponse.access_token}`
            },
            data: payload,
        };
        const response = await (0, axios_1.default)(options);
        res.json({ success: true, data: response.data, orderId: merchantOrderId });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Payment initiation failed",
            details: (err instanceof Error ? err.message : String(err)),
        });
    }
};
exports.initiateCheckoutv2 = initiateCheckoutv2;
const checkPaymentStatusv2 = async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!orderId)
            return res.status(400).json({ error: 'Order ID required' });
        const authResponse = await (0, phonepeAuthorizaiton_1.phonePeAuthorizations)();
        const options = {
            method: 'GET',
            url: `https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order/${orderId}/status`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `O-Bearer ${authResponse.access_token}`
            }
        };
        const response = await axios_1.default.request(options);
        console.log("Payment Status Response:", response.status, response.data);
        if (response.status === 204) {
            return res.json({
                success: true,
                status: 'PENDING',
                message: 'No status available yet. Payment may still be in progress.'
            });
        }
        return res.json({
            success: true,
            status: response.data.state,
            data: response.data,
            merchantOrderId: orderId
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Status check failed', details: err.message });
    }
};
exports.checkPaymentStatusv2 = checkPaymentStatusv2;
//# sourceMappingURL=payment-controller.js.map
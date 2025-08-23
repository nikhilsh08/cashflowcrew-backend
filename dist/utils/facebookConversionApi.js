"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// services/facebookConversionAPI.ts
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
class FacebookConversionAPI {
    constructor(accessToken, pixelId, testEventCode) {
        this.baseUrl = 'https://graph.facebook.com/v18.0';
        this.accessToken = accessToken;
        this.pixelId = pixelId;
        this.testEventCode = testEventCode;
    }
    hashData(data) {
        if (!data)
            return '';
        return crypto_1.default.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
    }
    createPurchaseEvent(paymentData, userData, requestData) {
        const eventTime = Math.floor(Date.now() / 1000);
        return {
            event_name: 'Purchase',
            event_time: eventTime,
            event_id: paymentData.transactionId || paymentData.orderId,
            user_data: {
                em: userData.email ? this.hashData(userData.email) : undefined,
                ph: userData.phone ? this.hashData(userData.phone.replace(/\D/g, '')) : undefined,
                external_id: userData.userId,
                fn: userData.firstName ? this.hashData(userData.firstName) : undefined,
                ln: userData.lastName ? this.hashData(userData.lastName) : undefined,
                client_ip_address: requestData.ip,
                client_user_agent: requestData.userAgent,
                fbc: requestData.fbc,
                fbp: requestData.fbp
            },
            custom_data: {
                currency: paymentData.currency || 'INR',
                value: parseFloat(paymentData.amount.toString()),
                content_ids: [paymentData.productId || 'masterclass_enrollment'],
                content_type: 'product',
                content_name: 'Masterclass Enrollment'
            },
            action_source: 'website',
            event_source_url: `${process.env.WEBSITE_URL}/verify/${paymentData.orderId}`
        };
    }
    async sendPurchaseEvent(paymentData, userData, requestData) {
        try {
            const eventData = this.createPurchaseEvent(paymentData, userData, requestData);
            const payload = {
                data: [eventData],
                access_token: this.accessToken
            };
            if (this.testEventCode) {
                payload.test_event_code = this.testEventCode;
            }
            const response = await axios_1.default.post(`${this.baseUrl}/${this.pixelId}/events`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Facebook Purchase event sent successfully:', response.data);
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error('Error sending Facebook conversion:', error.response?.data || error.message);
            }
            else {
                console.error('Error sending Facebook conversion:', error.message || error);
            }
            throw error;
        }
    }
}
exports.default = FacebookConversionAPI;
//# sourceMappingURL=facebookConversionApi.js.map
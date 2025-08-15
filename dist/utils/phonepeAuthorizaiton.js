"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.phonePeAuthorizations = void 0;
const axios_1 = __importDefault(require("axios"));
const phonePeAuthorizations = async () => {
    const requestHeaders = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    const requestBodyJson = {
        "client_version": "1",
        "grant_type": "client_credentials",
        "client_id": `${process.env.PHONEPE_CLIENT_ID}`,
        "client_secret": `${process.env.PHONEPE_CLIENT_SECRET}`
    };
    const requestBody = new URLSearchParams(requestBodyJson).toString();
    const options = {
        method: 'POST',
        url: 'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token',
        headers: requestHeaders,
        data: requestBody
    };
    try {
        const response = await axios_1.default.request(options);
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
};
exports.phonePeAuthorizations = phonePeAuthorizations;
//# sourceMappingURL=phonepeAuthorizaiton.js.map
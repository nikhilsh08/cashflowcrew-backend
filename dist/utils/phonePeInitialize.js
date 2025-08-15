"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_sdk_node_1 = require("pg-sdk-node");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class PhonePeClient {
    static getClient() {
        console.log("PHONEPE ENVIORNMENT PHINITIALIZE", process.env.PHONEPE_ENV);
        if (!this.instance) {
            this.instance = pg_sdk_node_1.StandardCheckoutClient.getInstance(process.env.PHONEPE_CLIENT_ID, process.env.PHONEPE_CLIENT_SECRET, parseInt(process.env.PHONEPE_CLIENT_VERSION), process.env.PHONEPE_ENV === 'PRODUCTION' ? pg_sdk_node_1.Env.PRODUCTION : pg_sdk_node_1.Env.SANDBOX);
        }
        return this.instance;
    }
    static resetClient() {
        console.log("Resetting PhonePe Client");
        if (this.instance) {
            this.instance = null;
        }
    }
}
PhonePeClient.instance = null;
exports.default = PhonePeClient;
//# sourceMappingURL=phonePeInitialize.js.map
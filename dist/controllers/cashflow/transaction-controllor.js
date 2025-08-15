"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransaction = void 0;
exports.mapPhonePeToTransaction = mapPhonePeToTransaction;
const TransactionDetail_1 = __importDefault(require("../../model/TransactionDetail"));
const createTransaction = async (transactionData, userId) => {
    try {
        const findTransaction = await TransactionDetail_1.default.findOne({ orderId: transactionData.orderId, userId });
        if (findTransaction) {
            // If transaction exists, update it
            return null;
        }
        // If not, create a new transaction
        const newTransaction = new TransactionDetail_1.default(transactionData);
        const savedTransaction = await newTransaction.save();
        return savedTransaction;
    }
    catch (error) {
        console.error("Error creating transaction:", error);
        throw error;
    }
};
exports.createTransaction = createTransaction;
function mapPhonePeToTransaction(response, userId, orderId) {
    return {
        userId: userId,
        orderId: orderId,
        state: response.state,
        amount: response.amount,
        payableAmount: response.payableAmount,
        feeAmount: response.feeAmount,
        expireAt: response.expireAt,
        errorCode: response.errorCode,
        detailedErrorCode: response.detailedErrorCode,
        paymentDetails: (response.paymentDetails || []).map((pd) => ({
            paymentMode: pd.paymentMode,
            transactionId: pd.transactionId,
            timestamp: pd.timestamp,
            amount: pd.amount,
            state: pd.state,
            splitInstruments: (pd.splitInstruments || []).map((si) => ({
                amount: si.amount,
                rail: si.rail || {},
                instrument: si.instrument || {}
            }))
        }))
    };
}
//# sourceMappingURL=transaction-controllor.js.map
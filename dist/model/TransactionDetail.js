"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RailSchema = new mongoose_1.Schema({
    type: { type: String, required: false },
    transactionId: { type: String, required: false },
    authorizationCode: { type: String, required: false },
    serviceTransactionId: { type: String, required: false },
    utr: { type: String, required: false },
    upiTransactionId: { type: String, required: false },
});
const InstrumentSchema = new mongoose_1.Schema({
    type: { type: String, required: false },
    bankTransactionId: { type: String, required: false },
    bankId: { type: String, required: false },
    arn: { type: String, required: false },
    brn: { type: String, required: false },
    geoScope: { type: String, required: false },
    cardNetwork: { type: String, required: false },
    maskedCardNumber: { type: String, required: false },
    ifsc: { type: String, required: false },
    accountType: { type: String, required: false },
});
const SplitInstrumentSchema = new mongoose_1.Schema({
    amount: { type: Number, required: true },
    rail: { type: RailSchema, required: false },
    instrument: { type: InstrumentSchema, required: false },
});
const PaymentDetailSchema = new mongoose_1.Schema({
    paymentMode: { type: String, required: true },
    transactionId: { type: String, required: true },
    timestamp: { type: Number, required: true },
    amount: { type: Number, required: true },
    state: { type: String, required: true },
    splitInstruments: { type: [SplitInstrumentSchema], required: false },
});
const TransactionDetailsSchema = new mongoose_1.Schema({
    orderId: { type: String, required: true },
    paymentDetails: { type: [PaymentDetailSchema], required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    state: { type: String, required: false },
    amount: { type: Number, required: false },
    payableAmount: { type: Number, required: false },
    feeAmount: { type: Number, required: false },
    expireAt: { type: Number, required: false },
    errorCode: { type: String, required: false },
    detailedErrorCode: { type: String, required: false },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("TransactionDetails", TransactionDetailsSchema);
//# sourceMappingURL=TransactionDetail.js.map
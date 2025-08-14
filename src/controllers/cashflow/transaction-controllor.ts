import type mongoose from "mongoose";
import TransactionDetail, { type ITransactionDetails } from "../../model/TransactionDetail";


export const createTransaction = async (transactionData: Omit<ITransactionDetails, keyof Document>, userId: mongoose.Types.ObjectId) => {
  try {
    const findTransaction = await TransactionDetail.findOne({ orderId: transactionData.orderId, userId });
    if (findTransaction) {
      // If transaction exists, update it
      return null;
    }
    // If not, create a new transaction
    const newTransaction = new TransactionDetail(transactionData);
    const savedTransaction = await newTransaction.save();
    return savedTransaction; 
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error; 
  }
};


export function mapPhonePeToTransaction(response: any, userId: mongoose.Types.ObjectId, orderId: string): Partial<ITransactionDetails> {
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
    paymentDetails: (response.paymentDetails || []).map((pd: any) => ({
      paymentMode: pd.paymentMode,
      transactionId: pd.transactionId,
      timestamp: pd.timestamp,
      amount: pd.amount,
      state: pd.state,
      splitInstruments: (pd.splitInstruments || []).map((si: any) => ({
        amount: si.amount,
        rail: si.rail || {},
        instrument: si.instrument || {}
      }))
    }))
  };
}

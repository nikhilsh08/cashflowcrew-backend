import mongoose, { Schema, model, Document } from "mongoose";

export interface IRail {
  type?: string;
  transactionId?: string;
  authorizationCode?: string;
  serviceTransactionId?: string;
  utr?: string;
  upiTransactionId?: string;
}

export interface IInstrument {
  type?: string;
  bankTransactionId?: string;
  bankId?: string;
  arn?: string;
  brn?: string;
  geoScope?: string;
  cardNetwork?: string;
  maskedCardNumber?: string;
  ifsc?: string;
  accountType?: string;
}

export interface ISplitInstrument {
  amount: number;
  rail?: IRail;
  instrument?: IInstrument;
}

export interface IPaymentDetail {
  paymentMode: string;
  transactionId: string;
  timestamp: number;
  amount: number;
  state: string;
  splitInstruments?: ISplitInstrument[];
}

export interface ITransactionDetails extends Document {
  orderId: string;
  paymentDetails: IPaymentDetail[];
  userId: mongoose.Types.ObjectId;
  state?: string;
  amount?: number;
  payableAmount?: number;
  feeAmount?: number;
  expireAt?: number;
  errorCode?: string;
  detailedErrorCode?: string;
}

const RailSchema = new Schema<IRail>({
  type: { type: String, required: false },
  transactionId: { type: String, required: false },
  authorizationCode: { type: String, required: false },
  serviceTransactionId: { type: String, required: false },
  utr: { type: String, required: false },
  upiTransactionId: { type: String, required: false },
});

const InstrumentSchema = new Schema<IInstrument>({
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

const SplitInstrumentSchema = new Schema<ISplitInstrument>({
  amount: { type: Number, required: true },
  rail: { type: RailSchema, required: false },
  instrument: { type: InstrumentSchema, required: false },
});

const PaymentDetailSchema = new Schema<IPaymentDetail>({
  paymentMode: { type: String, required: true },
  transactionId: { type: String, required: true },
  timestamp: { type: Number, required: true },
  amount: { type: Number, required: true },
  state: { type: String, required: true },
  splitInstruments: { type: [SplitInstrumentSchema], required: false },
});

const TransactionDetailsSchema = new Schema<ITransactionDetails>(
  {
    orderId: { type: String, required: true },
    paymentDetails: { type: [PaymentDetailSchema], required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    state: { type: String, required: false },
    amount: { type: Number, required: false },
    payableAmount: { type: Number, required: false },
    feeAmount: { type: Number, required: false },
    expireAt: { type: Number, required: false },
    errorCode: { type: String, required: false },
    detailedErrorCode: { type: String, required: false },
  },
  { timestamps: true }
);

export default model<ITransactionDetails>(
  "TransactionDetails",
  TransactionDetailsSchema
);

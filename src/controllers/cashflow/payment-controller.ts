import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import PhonePeClient from '../../utils/phonePeInitialize';
import { StandardCheckoutPayRequest, CreateSdkOrderRequest } from 'pg-sdk-node';
import axios from 'axios';
import { userRegister } from './user-controller';
import crypto from 'crypto';
import { phonePeAuthorizations } from '../../utils/phonepeAuthorizaiton';
import User from '../../model/Users';
import { createTransaction, mapPhonePeToTransaction } from './transaction-controllor';
import type { ITransactionDetails } from '../../model/TransactionDetail';


// Initiate Standard Checkout
export const initiateCheckout = async (req: Request, res: Response) => {
  try {
    const { amount, firstName, lastName, email, phone, coupon } = req.body;
    console.log("amount....",amount)
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

    const merchantOrderId = `ORDER_${uuidv4()}`;
    const redirectUrl = `${process.env.PHONEPE_REDIRECT_URL}/payment/status/${merchantOrderId}`;
 

    const user = await userRegister({firstName, lastName, email, phone, coupon})


    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(Math.round(amount * 100))
      .redirectUrl(redirectUrl)
      .build();

    const response = await PhonePeClient.getClient().pay(request);
    await User.findByIdAndUpdate(user._id, { orderId: merchantOrderId });
    console.log("Payment Response:", response, merchantOrderId);

    res.json({ success: true, checkoutUrl: response.redirectUrl, orderId: merchantOrderId,email: user.email });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Payment initiation failed', details: err.message });
  }
};

// Create SDK Order
export const createSdkOrder = async (req: Request, res: Response) => {
  try {
    const { amount, firstName, lastName, email, phone, coupon } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

    const merchantOrderId = `ORDER_${uuidv4()}`;
    const redirectUrl = `${process.env.PHONEPE_REDIRECT_URL}/payment/status/${merchantOrderId}`;

    const user = await userRegister({firstName, lastName, email, phone, coupon})


    const request = CreateSdkOrderRequest.StandardCheckoutBuilder()
      .merchantOrderId(merchantOrderId)
      .amount(Math.round(amount * 100))
      .redirectUrl(redirectUrl)
      .build();

    const response = await PhonePeClient.getClient().createSdkOrder(request);

    res.json({ success: true, token: response.token, orderId: merchantOrderId });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Order creation failed', details: err.message });
  }
};

// Check Payment Status
export const checkPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(400).json({ error: "Order ID required" });

    const response = await PhonePeClient.getClient().getOrderStatus(orderId);
    const getUser = await User.findOne({ orderId });
    let transactionData: any;
    console.log("user details....:", getUser);

    if (getUser) {
      const mappedData = mapPhonePeToTransaction(response, getUser._id, orderId);
      // Ensure orderId is always a string
      if (typeof mappedData.orderId !== 'string' || !mappedData.orderId) {
        mappedData.orderId = orderId;
      }
      transactionData = await createTransaction(mappedData as Omit<ITransactionDetails, keyof Document>, getUser._id);
    }
    console.log("Transaction Data:", transactionData);

    res.json({ success: true, status: response.state, data: response });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Status check failed", details: err.message });
  }
};


// Handle Callback
export const handleCallback = async (req: Request, res: Response) => {
  try {
    const authHeader = req.header('authorization') || '';
    const bodyStr = JSON.stringify(req.body);

    const isValid = await PhonePeClient.getClient().validateCallback(
      process.env.MERCHANT_USERNAME!,
      process.env.MERCHANT_PASSWORD!,
      authHeader,
      bodyStr
    );

    if (!isValid) return res.status(401).json({ error: 'Invalid callback' });

    const { type, payload } = req.body;
    const { merchantOrderId, state } = payload;

    // Handle based on type (PAYMENT_SUCCESS, PAYMENT_ERROR...)
    console.log(`Callback for order ${merchantOrderId}: status ${state}`);

    res.status(200).send('OK');
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Callback processing failed', details: err.message });
  }
};




export const initiateCheckoutv2 = async (req:Request, res: Response) => {
  try {
    const { amount, firstName, lastName, email, phone, coupon } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const merchantOrderId = `ORDER_${uuidv4()}`;
    const redirectUrl = `${process.env.PHONEPE_REDIRECT_URL}/payment/status/${merchantOrderId}`;

    const amountInPaise = Math.round(amount * 100);

    const authResponse = await phonePeAuthorizations();
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

    const sha256 = crypto
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

    const response = await axios(options);
    res.json({ success: true, data: response.data ,orderId: merchantOrderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Payment initiation failed",
      details: (err instanceof Error ? err.message : String(err)),
    });
  }
};

export const checkPaymentStatusv2 = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(400).json({ error: 'Order ID required' });

    const authResponse = await phonePeAuthorizations();

    const options = {
      method: 'GET',
      url: `https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order/${orderId}/status`,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `O-Bearer ${authResponse.access_token}`
      }
    };

    const response = await axios.request(options);
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

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Status check failed', details: err.message });
  }
};

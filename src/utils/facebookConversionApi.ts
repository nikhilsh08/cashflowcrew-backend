// services/facebookConversionAPI.ts
import crypto from 'crypto';
import axios from 'axios';

interface UserData {
  email?: string;
  phone?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
}

interface PaymentData {
  transactionId: string;
  orderId: string;
  amount: number;
  currency?: string;
  productId?: string;
}

interface RequestData {
  ip: string;
  userAgent: string;
  fbp?: string;
  fbc?: string;
}

class FacebookConversionAPI {
  private accessToken: string;
  private pixelId: string;
  private testEventCode?: string;
  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor(accessToken: string, pixelId: string, testEventCode?: string) {
    this.accessToken = accessToken;
    this.pixelId = pixelId;
    this.testEventCode = testEventCode;
  }

  private hashData(data: string): string {
    if (!data) return '';
    return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
  }

  private createPurchaseEvent(paymentData: PaymentData, userData: UserData, requestData: RequestData) {
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

  async sendPurchaseEvent(paymentData: PaymentData, userData: UserData, requestData: RequestData) {
    try {
      const eventData = this.createPurchaseEvent(paymentData, userData, requestData);
      
      const payload: {
        data: any[];
        access_token: string;
        test_event_code?: string;
      } = {
        data: [eventData],
        access_token: this.accessToken
      };

      if (this.testEventCode) {
        payload.test_event_code = this.testEventCode;
      }

      const response = await axios.post(
        `${this.baseUrl}/${this.pixelId}/events`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Facebook Purchase event sent successfully:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error sending Facebook conversion:', error.response?.data || error.message);
      } else {
        console.error('Error sending Facebook conversion:', (error as Error).message || error);
      }
      throw error;
    }
  }
}

export default FacebookConversionAPI;

import { StandardCheckoutClient, Env } from 'pg-sdk-node';
import dotenv from 'dotenv';
dotenv.config();
class PhonePeClient {
  private static instance: StandardCheckoutClient | null = null;

  static getClient(): StandardCheckoutClient {
    console.log("PHONEPE ENVIORNMENT PHINITIALIZE",process.env.PHONEPE_ENV)
    if (!this.instance) {
      this.instance = StandardCheckoutClient.getInstance(
        process.env.PHONEPE_CLIENT_ID!,
        process.env.PHONEPE_CLIENT_SECRET!,
        parseInt(process.env.PHONEPE_CLIENT_VERSION!),
        process.env.PHONEPE_ENV === 'PRODUCTION' ? Env.PRODUCTION : Env.SANDBOX
      );
    }
    return this.instance;
  }
  static resetClient(): void {
    console.log("Resetting PhonePe Client");
    if (this.instance) {
      this.instance = null;
    }
  }
}

export default PhonePeClient;

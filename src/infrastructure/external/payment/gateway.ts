import { PaymentGateway } from '@interfaces/gateways/PaymentGateway.gateway';
import { v4 as uuidv4 } from 'uuid';

export class FakePaymentGateway implements PaymentGateway {
  async createPayment(amount: number, orderNumber: string | number): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return `QR-${uuidv4().toUpperCase().replace(/-/g, '')}-${orderNumber}-${amount}`;
  }
}

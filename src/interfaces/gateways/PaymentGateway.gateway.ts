export interface PaymentGateway {
  createPayment(amount: number, orderNumber: string | number): Promise<string>;
}

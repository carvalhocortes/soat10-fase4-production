import { PaymentStatus } from '@core/entities/order.entity';

export class UpdateOrderPaymentStatusDTO {
  constructor(
    public readonly paymentId: string,
    public readonly status: PaymentStatus,
  ) {}

  static create(data: { params: { id?: string }; body: { status: PaymentStatus } }): UpdateOrderPaymentStatusDTO {
    if (!data.params.id) {
      throw new Error('Order ID is required');
    }

    return new UpdateOrderPaymentStatusDTO(data.params.id, data.body.status);
  }
}

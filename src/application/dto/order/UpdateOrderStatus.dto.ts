import { OrderStatus } from '@core/entities/order.entity';

export class UpdateOrderStatusDTO {
  constructor(
    public readonly id: string,
    public readonly status: OrderStatus,
  ) {}

  static create(data: { params: { id?: string }; body: { status: string } }): UpdateOrderStatusDTO {
    if (!data.params.id) {
      throw new Error('Order ID is required');
    }

    return new UpdateOrderStatusDTO(data.params.id, data.body.status as OrderStatus);
  }
}

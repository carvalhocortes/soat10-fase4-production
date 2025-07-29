import { OrderStatus } from '@core/entities/order.entity';

export class UpdateProductionStatusDTO {
  constructor(
    public readonly id: string,
    public readonly status: OrderStatus,
  ) {}

  static create(data: { params: { id?: string }; body: { status: string } }): UpdateProductionStatusDTO {
    if (!data.params.id) {
      throw new Error('Order ID is required');
    }

    return new UpdateProductionStatusDTO(data.params.id, data.body.status as OrderStatus);
  }
}

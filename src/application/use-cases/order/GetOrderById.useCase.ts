import { Order } from '@core/entities/order.entity';
import { OrderRepository } from '@interfaces/gateways/OrderRepository.gateway';
import { NotFoundError } from '@shared/errors/NotFoundError';

export class GetOrderByIdUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: string): Promise<Order | null> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    return order;
  }
}

import { Order } from '@core/entities/order.entity';
import { OrderRepository } from '@interfaces/gateways/OrderRepository.gateway';
import { NotFoundError } from '@shared/errors/NotFoundError';

export class GetOrderByNumberUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(number: number): Promise<Order | null> {
    const order = await this.orderRepository.findByNumber(number);
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    return order;
  }
}

import { Order, OrderStatus } from '@core/entities/order.entity';
import { OrderRepository } from '@interfaces/gateways/OrderRepository.gateway';

export class ListOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(): Promise<Order[]> {
    const allOrders = await this.orderRepository.findAll();

    const statusPriority: Record<OrderStatus, number> = {
      ready: 1,
      in_preparation: 2,
      received: 3,
      completed: 4,
      cancelled: 5,
    };

    return allOrders
      .filter((order) => order.status !== 'completed' && order.status !== 'cancelled')
      .sort((a, b) => {
        if (statusPriority[a.status] !== statusPriority[b.status]) {
          return statusPriority[a.status] - statusPriority[b.status];
        }
        return (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0);
      });
  }
}

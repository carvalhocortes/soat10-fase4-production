import { UpdateOrderStatusDTO } from '@application/dto/order/UpdateOrderStatus.dto';
import { Order } from '@core/entities/order.entity';
import { OrderRepository } from '@interfaces/gateways/OrderRepository.gateway';
import { NotFoundError } from '@shared/errors/NotFoundError';

export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute({ id, status }: UpdateOrderStatusDTO): Promise<Order | null> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    order.updateStatus(status);

    return this.orderRepository.update(id, order);
  }
}

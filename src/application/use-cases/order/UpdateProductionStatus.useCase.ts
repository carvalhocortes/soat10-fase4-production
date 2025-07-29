import { UpdateProductionStatusDTO } from '@application/dto/order/UpdateProductionStatus.dto';
import { Order } from '@core/entities/order.entity';
import { SnsPublisher } from '@infrastructure/external/snsPublisher';
import { OrderRepository } from '@interfaces/gateways/OrderRepository.gateway';
import { NotFoundError } from '@shared/errors/NotFoundError';

export class UpdateProductionStatusUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly snsPublisher: SnsPublisher,
  ) {}

  async execute({ id, status }: UpdateProductionStatusDTO): Promise<Order | null> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    order.updateStatus(status);

    await this.snsPublisher.publish({
      eventType: 'PRODUCTION_STATUS_UPDATED',
      payload: order,
    });

    return this.orderRepository.update(id, order);
  }
}

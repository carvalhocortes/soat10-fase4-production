import { OrderRepository } from '@interfaces/gateways/OrderRepository.gateway';
import { Order } from '@core/entities/order.entity';
import { SnsPublisher } from '@infrastructure/external/snsPublisher';
import { ProcessOrderCreatedDTO } from '@application/dto/order/ProcessOrderCreated.dto';

export class ProcessOrderCreatedUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly snsPublisher: SnsPublisher,
  ) {}

  async execute({ orderId }: ProcessOrderCreatedDTO): Promise<Order> {
    const order = Order.create({
      id: orderId,
      orderId,
      status: 'received',
    });
    await this.orderRepository.save(order);

    await this.snsPublisher.publish({
      eventType: 'ORDER_PRODUCTION_CREATED',
      payload: {
        orderId,
        status: order.status,
      },
    });
    return order;
  }
}

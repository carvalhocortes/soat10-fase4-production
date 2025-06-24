import { UpdateOrderPaymentStatusDTO } from '@application/dto/payment/UpdateOrderPayment.dto';
import { Order } from '@core/entities/order.entity';
import { OrderRepository } from '@interfaces/gateways/OrderRepository.gateway';
import { NotFoundError } from '@shared/errors/NotFoundError';

export class UpdateOrderPaymentStatusUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute({ paymentId, status }: UpdateOrderPaymentStatusDTO): Promise<Order | null> {
    const order = await this.orderRepository.findByPaymentId(paymentId);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    order.updatePayment(status);

    return this.orderRepository.update(order.id!, order);
  }
}

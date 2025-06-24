import { OrderRepository } from '@interfaces/gateways/OrderRepository.gateway';

export class DeleteOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: string): Promise<void> {
    await this.orderRepository.delete(id);
  }
}

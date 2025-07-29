import { AppDataSource } from '../config/database.config';
import { Repository } from 'typeorm';
import { Order } from '@core/entities/order.entity';

export class TypeORMOrderRepository {
  private repo: Repository<Order>;

  constructor() {
    this.repo = AppDataSource.getRepository(Order);
  }

  async save(order: Order): Promise<Order> {
    const savedOrder = await this.repo.save(order);
    return Order.reconstruct(savedOrder);
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.repo.findOneBy({ id });
    if (!order) {
      return null;
    }
    return Order.reconstruct(order);
  }

  async update(id: string, order: Partial<Order>): Promise<Order | null> {
    await this.repo.update(id, order);
    const updatedOrder = await this.findById(id);
    return Order.reconstruct(updatedOrder!);
  }
}

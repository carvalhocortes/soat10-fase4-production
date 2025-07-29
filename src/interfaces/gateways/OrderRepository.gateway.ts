import { Order } from '@core/entities/order.entity';

export interface OrderRepository {
  save(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  update(id: string, order: Order): Promise<Order | null>;
}

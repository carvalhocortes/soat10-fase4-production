import { Order } from '@core/entities/order.entity';

export interface OrderRepository {
  save(order: Order): Promise<Order>;
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  findByPaymentId(paymentId: string): Promise<Order | null>;
  findByNumber(orderNumber: number): Promise<Order | null>;
  delete(id: string): Promise<void>;
  update(id: string, order: Order): Promise<Order | null>;
}

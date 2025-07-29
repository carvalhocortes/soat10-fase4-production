import { OrderRepository } from '@interfaces/gateways/OrderRepository.gateway';
import { Order, OrderProps } from '@core/entities/order.entity';
import { OrderModel } from '@infrastructure/db/models/order.model';

export class DynamoOrderRepository implements OrderRepository {
  async save(order: Order): Promise<Order> {
    const newOrder = new OrderModel(order);
    await newOrder.save();
    return Order.reconstruct(this.toOrderProps(newOrder));
  }

  async findById(id: string): Promise<Order | null> {
    const order = await OrderModel.get(id);
    if (!order) {
      return null;
    }
    return Order.reconstruct(this.toOrderProps(order));
  }

  async update(id: string, order: Order): Promise<Order | null> {
    const { ...orderProps } = order;
    delete orderProps.id;
    const updatedOrder = await OrderModel.update(id, orderProps);
    if (!updatedOrder) {
      return null;
    }
    return Order.reconstruct(this.toOrderProps(updatedOrder));
  }

  private toOrderProps(document: OrderProps): OrderProps {
    return {
      id: document.id,
      orderId: document.orderId,
      status: document.status,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}

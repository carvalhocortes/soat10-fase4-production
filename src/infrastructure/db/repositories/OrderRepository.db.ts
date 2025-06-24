import { OrderRepository } from '@interfaces/gateways/OrderRepository.gateway';
import { Order, OrderProps } from '@core/entities/order.entity';
import { OrderModel } from '@infrastructure/db/models/order.model';

export class DynamoOrderRepository implements OrderRepository {
  async save(order: Order): Promise<Order> {
    const newOrder = new OrderModel(order);
    await newOrder.save();
    return Order.reconstruct(this.toOrderProps(newOrder));
  }

  async findAll(): Promise<Order[]> {
    const orders = await OrderModel.scan().exec();
    if (orders.length === 0) {
      return [];
    }
    return orders.map((order) => Order.reconstruct(this.toOrderProps(order)));
  }

  async findById(id: string): Promise<Order | null> {
    const order = await OrderModel.get(id);
    if (!order) {
      return null;
    }
    return Order.reconstruct(this.toOrderProps(order));
  }

  async findByPaymentId(paymentId: string): Promise<Order | null> {
    const order = await OrderModel.scan('paymentId').eq(paymentId).exec();
    if (order.count === 0) {
      return null;
    }
    return Order.reconstruct(this.toOrderProps(order[0]));
  }

  async findByNumber(orderNumber: number): Promise<Order | null> {
    const order = await OrderModel.scan('orderNumber').eq(orderNumber).exec();
    if (order.count === 0) {
      return null;
    }
    return Order.reconstruct(this.toOrderProps(order[0]));
  }

  async delete(id: string): Promise<void> {
    await OrderModel.delete(id);
  }

  async update(id: string, order: Order): Promise<Order | null> {
    const { ...orderProps } = order; // TO ACHANDO FEIO DE MAIS...
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
      customerId: document.customerId?.toString(),
      products: document.products.map((product) => ({
        id: product.id.toString(),
        quantity: product.quantity,
      })),
      total: document.total,
      status: document.status,
      orderNumber: document.orderNumber,
      paymentId: document.paymentId,
      paymentStatus: document.paymentStatus,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}

import { Order } from '../../core/entities/order.entity';
import { ValidationError } from '../../shared/errors/ValidationError';

describe('Order Entity', () => {
  it('should create an order with default status received', () => {
    const order = Order.create({ id: 'id1', orderId: 'order-1' });
    expect(order.status).toBe('received');
    expect(order.id).toBe('id1');
    expect(order.orderId).toBe('order-1');
    expect(order.createdAt).toBeInstanceOf(Date);
    expect(order.updatedAt).toBeInstanceOf(Date);
  });

  it('should update status with valid transition', () => {
    const order = Order.create({ id: 'id2', orderId: 'order-2', status: 'received' });
    order.updateStatus('in_preparation');
    expect(order.status).toBe('in_preparation');
    order.updateStatus('ready');
    expect(order.status).toBe('ready');
    order.updateStatus('completed');
    expect(order.status).toBe('completed');
  });

  it('should throw ValidationError for invalid status transition', () => {
    const order = Order.create({ id: 'id3', orderId: 'order-3', status: 'received' });
    expect(() => order.updateStatus('ready')).toThrow(ValidationError);
  });

  it('should serialize to JSON correctly', () => {
    const order = Order.create({ id: 'id4', orderId: 'order-4', status: 'cancelled' });
    const json = order.toJSON();
    expect(json).toEqual({
      id: 'id4',
      customerId: 'order-4',
      status: 'cancelled',
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  });
});

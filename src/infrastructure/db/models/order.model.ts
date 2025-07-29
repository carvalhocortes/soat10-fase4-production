import { OrderStatus } from '@core/entities/order.entity';
import * as dynamoose from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';

interface OrderProps extends Item {
  id?: string;
  orderId?: string;
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new dynamoose.Schema({
  id: { type: String, hashKey: true, required: true },
  orderId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['received', 'in_preparation', 'ready', 'completed', 'cancelled'],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const OrderModel = dynamoose.model<OrderProps>('Order', orderSchema, {
  tableName: 'orders',
});

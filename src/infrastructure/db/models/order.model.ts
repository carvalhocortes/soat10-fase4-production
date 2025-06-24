import { OrderStatus, PaymentStatus, Product } from '@core/entities/order.entity';
import * as dynamoose from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';

interface OrderProps extends Item {
  id?: string;
  customerId?: string;
  products: Product[];
  total: number;
  status: OrderStatus;
  orderNumber: number;
  paymentStatus: PaymentStatus;
  paymentId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new dynamoose.Schema({
  id: { type: String, hashKey: true, required: true },
  customerId: {
    type: String,
    required: true,
  },
  products: {
    type: Array,
    schema: [
      {
        type: Object,
        schema: {
          id: { type: String, required: true },
          quantity: { type: Number, required: true },
        },
      },
    ],
    required: true,
  },
  orderNumber: { type: Number, required: true },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['received', 'in_preparation', 'ready', 'completed', 'cancelled'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'expired', 'pending'],
    required: true,
  },
  paymentId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const OrderModel = dynamoose.model<OrderProps>('Order', orderSchema, {
  tableName: 'orders',
});

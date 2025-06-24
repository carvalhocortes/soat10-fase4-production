import { ValidationError } from '@shared/errors/ValidationError';
import { v4 as uuidv4 } from 'uuid';

export type OrderStatus = 'received' | 'in_preparation' | 'ready' | 'completed' | 'cancelled';

export type PaymentStatus = 'paid' | 'expired' | 'pending';

export type Product = { id: string; quantity: number };

export interface OrderProps {
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

export class Order {
  public readonly id?: string;
  public readonly customerId?: string;
  public readonly products: Product[];
  public readonly total: number;
  public status: OrderStatus;
  public paymentStatus: PaymentStatus;
  public readonly orderNumber: number;
  public readonly paymentId: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  private constructor(props: OrderProps) {
    this.id = props.id || uuidv4();
    this.customerId = props.customerId;
    this.products = props.products;
    this.total = props.total;
    this.status = props.status;
    this.paymentStatus = props.paymentStatus;
    this.orderNumber = props.orderNumber;
    this.paymentId = props.paymentId;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  public static create(props: Omit<OrderProps, 'createdAt' | 'updatedAt'>): Order {
    this.validate(props);

    return new Order({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public updateStatus(newStatus: OrderStatus): void {
    this.validateStatusTransition(newStatus);
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  public updatePayment(status: PaymentStatus): void {
    if (status === 'paid') {
      this.status = 'in_preparation';
      this.paymentStatus = 'paid';
    } else {
      this.status = 'cancelled';
      this.paymentStatus = 'expired';
    }
    this.updatedAt = new Date();
  }

  public static reconstruct(props: OrderProps): Order {
    return new Order(props);
  }

  public toJSON() {
    return {
      id: this.id,
      customerId: this.customerId,
      products: this.products,
      total: this.total,
      status: this.status,
      orderNumber: this.orderNumber,
      paymentId: this.paymentId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private validateStatusTransition(newStatus: OrderStatus): void {
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      received: ['in_preparation', 'cancelled'],
      in_preparation: ['ready', 'cancelled'],
      ready: ['completed'],
      completed: [],
      cancelled: [],
    };

    if (!allowedTransitions[this.status].includes(newStatus)) {
      throw new ValidationError(`Invalid status transition from ${this.status} to ${newStatus}`);
    }
  }

  private static validate(props: Omit<OrderProps, 'id' | 'createdAt' | 'updatedAt'>): void {
    if (props.total <= 0) {
      throw new ValidationError('Total must be greater than zero');
    }

    if (props.products.length === 0) {
      throw new ValidationError('Order must have at least one product');
    }

    this.validateProducts(props.products);
  }

  private static validateProducts(products: Array<{ id: string; quantity: number }>): void {
    for (const product of products) {
      if (product.quantity <= 0) {
        throw new ValidationError(`Invalid quantity for product ${product.id}`);
      }
    }
  }
}

import { ValidationError } from '@shared/errors/ValidationError';
import { v4 as uuidv4 } from 'uuid';

export type OrderStatus = 'received' | 'in_preparation' | 'ready' | 'completed' | 'cancelled';

export interface OrderProps {
  id?: string;
  orderId?: string;
  status?: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Order {
  public readonly id?: string;
  public readonly orderId?: string;
  public status: OrderStatus;
  public readonly createdAt: Date;
  public updatedAt: Date;

  private constructor(props: OrderProps) {
    this.id = props.id || uuidv4();
    this.orderId = props.orderId;
    this.status = props.status || 'received';
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  public static create(props: Omit<OrderProps, 'createdAt' | 'updatedAt'>): Order {
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

  public static reconstruct(props: OrderProps): Order {
    return new Order(props);
  }

  public toJSON() {
    return {
      id: this.id,
      customerId: this.orderId,
      status: this.status,
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
}

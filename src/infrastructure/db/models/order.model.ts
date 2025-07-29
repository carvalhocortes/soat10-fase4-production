import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type OrderStatus = 'received' | 'in_preparation' | 'ready' | 'completed' | 'cancelled';

@Entity('orders')
export class Order {
  @PrimaryColumn('varchar')
  id!: string;

  @Column('varchar')
  orderId!: string;

  @Column({ type: 'varchar' })
  status!: OrderStatus;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}

import * as dynamoose from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';

export interface CounterProps extends Item {
  name: string;
  seq: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const counterSchema = new dynamoose.Schema({
  name: { type: String, hashKey: true, required: true },
  seq: { type: Number, required: true },
});

export const CounterModel = dynamoose.model<CounterProps>('Counter', counterSchema, {
  tableName: 'counters',
});

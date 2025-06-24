import * as dynamoose from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';

export interface CustomerProps extends Item {
  id: string;
  cpf: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const customerSchema = new dynamoose.Schema({
  id: { type: String, hashKey: true, required: true },
  cpf: {
    type: String,
    required: true,
    index: {
      name: 'cpf-index',
      type: 'global',
      project: true,
    },
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const CustomerModel = dynamoose.model<CustomerProps>('Customer', customerSchema, {
  tableName: 'customers',
});

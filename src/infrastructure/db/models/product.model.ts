import * as dynamoose from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';

interface ProductProps extends Item {
  id?: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: Array<string>;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new dynamoose.Schema({
  id: { type: String, hashKey: true, required: true },
  name: { type: String, required: true },
  category: {
    type: String,
    required: true,
    index: {
      name: 'category-index',
      type: 'global',
      project: true,
    },
  },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  images: {
    type: Array,
    schema: [
      {
        type: String,
        required: true,
      },
    ],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ProductModel = dynamoose.model<ProductProps>('Product', productSchema, {
  tableName: 'products',
});

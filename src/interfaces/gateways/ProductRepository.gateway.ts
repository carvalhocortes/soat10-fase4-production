import { Product } from '@core/entities/product.entity';

export interface ProductRepository {
  save(customer: Product): Promise<Product>;
  findAll(category?: string): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findByIds(ids: string[]): Promise<Product[]>;
  delete(id: string): Promise<void>;
  update(id: string, product: Product): Promise<Product | null>;
}

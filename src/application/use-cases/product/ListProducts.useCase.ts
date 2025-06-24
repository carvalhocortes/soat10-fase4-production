import { Product } from '@core/entities/product.entity';
import { ProductRepository } from '@interfaces/gateways/ProductRepository.gateway';

export class ListProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}

import { Product } from '@core/entities/product.entity';
import { ProductRepository } from '@interfaces/gateways/ProductRepository.gateway';

export class GetProductByIdUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }
}

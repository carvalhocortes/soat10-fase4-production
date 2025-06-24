import { ProductRepository } from '@interfaces/gateways/ProductRepository.gateway';

export class DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<void> {
    return this.productRepository.delete(id);
  }
}

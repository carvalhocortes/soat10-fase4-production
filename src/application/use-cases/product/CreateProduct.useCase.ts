import { CreateProductDTO } from '@application/dto/product/CreateProduct.dto';
import { Product } from '@core/entities/product.entity';
import { ProductRepository } from '@interfaces/gateways/ProductRepository.gateway';

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(dto: CreateProductDTO): Promise<Product> {
    const product = Product.create(dto);
    return this.productRepository.save(product);
  }
}

import { UpdateProductDTO } from '@application/dto/product/UpdateProduct.dto';
import { Product } from '@core/entities/product.entity';
import { ProductRepository } from '@interfaces/gateways/ProductRepository.gateway';
import { NotFoundError } from '@shared/errors/NotFoundError';

export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(dto: UpdateProductDTO): Promise<Product | null> {
    const { id, ...productDto } = dto;
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const updatedProduct = Product.update(productDto);

    return this.productRepository.update(id, updatedProduct);
  }
}

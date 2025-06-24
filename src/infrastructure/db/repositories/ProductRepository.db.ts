import { ProductRepository } from '@interfaces/gateways/ProductRepository.gateway';
import { Product, ProductProps } from '@core/entities/product.entity';
import { ProductModel } from '@infrastructure/db/models/product.model';

export class DynamoProductRepository implements ProductRepository {
  async save(product: Product): Promise<Product> {
    const newProduct = new ProductModel(product);
    await newProduct.save();
    return Product.reconstruct(this.toProductProps(newProduct));
  }

  async findAll(category?: string): Promise<Product[]> {
    const products = category
      ? await ProductModel.query('category').eq(category).using('category-index').exec()
      : await ProductModel.scan().exec();
    if (products.length === 0) {
      return [];
    }
    return products.map((product) => Product.reconstruct(this.toProductProps(product)));
  }

  async findById(id: string): Promise<Product | null> {
    const product = await ProductModel.get(id);
    if (!product) {
      return null;
    }
    return Product.reconstruct(this.toProductProps(product));
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    const products = await ProductModel.batchGet(ids);
    if (products.length === 0) {
      return [];
    }
    return products.map((product) => Product.reconstruct(this.toProductProps(product)));
  }

  async delete(id: string): Promise<void> {
    await ProductModel.delete(id);
  }

  async update(id: string, product: Product): Promise<Product | null> {
    const { ...productProps } = product; // TO ACHANDO FEIO DE MAIS...
    delete productProps.id;
    const updatedProduct = await ProductModel.update(id, productProps);
    if (!updatedProduct) {
      return null;
    }
    return Product.reconstruct(this.toProductProps(updatedProduct));
  }

  private toProductProps(document: ProductProps): ProductProps {
    return {
      id: document.id,
      name: document.name,
      category: document.category,
      price: document.price,
      description: document.description,
      images: document.images,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}

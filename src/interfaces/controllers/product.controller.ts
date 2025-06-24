import { Request, Response } from 'express';
import { CreateProductUseCase } from '@application/use-cases/product/CreateProduct.useCase';
import { DeleteProductUseCase } from '@application/use-cases/product/DeleteProduct.useCase';
import { GetProductByIdUseCase } from '@application/use-cases/product/GetProductById.useCase';
import { ListProductsUseCase } from '@application/use-cases/product/ListProducts.useCase';
import { UpdateProductUseCase } from '@application/use-cases/product/UpdateProduct.useCase';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { CreateProductDTO } from '@application/dto/product/CreateProduct.dto';
import { UpdateProductDTO } from '@application/dto/product/UpdateProduct.dto';

export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  createProduct = async (req: Request, res: Response): Promise<void> => {
    const dto = CreateProductDTO.create(req);
    const product = await this.createProductUseCase.execute(dto);
    res.status(201).json(product);
  };

  getProductById = async ({ params }: Request, res: Response): Promise<void> => {
    const product = await this.getProductByIdUseCase.execute(params.id);
    if (!product) throw new NotFoundError(`Product with ID ${params.id} not found`);
    res.json(product);
  };

  listProducts = async (_: Request, res: Response): Promise<void> => {
    const products = await this.listProductsUseCase.execute();
    res.json(products);
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    const dto = UpdateProductDTO.create(req);
    const product = await this.updateProductUseCase.execute(dto);
    res.json(product);
  };

  deleteProduct = async ({ params }: Request, res: Response): Promise<void> => {
    await this.deleteProductUseCase.execute(params.id);
    res.sendStatus(204);
  };
}

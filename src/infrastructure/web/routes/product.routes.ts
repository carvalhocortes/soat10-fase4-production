import express from 'express';
import { DynamoProductRepository } from '@infrastructure/db/repositories/ProductRepository.db';
import { ProductController } from '@interfaces/controllers/product.controller';
import { CreateProductUseCase } from '@application/use-cases/product/CreateProduct.useCase';
import { ListProductsUseCase } from '@application/use-cases/product/ListProducts.useCase';
import { GetProductByIdUseCase } from '@application/use-cases/product/GetProductById.useCase';
import { UpdateProductUseCase } from '@application/use-cases/product/UpdateProduct.useCase';
import { DeleteProductUseCase } from '@application/use-cases/product/DeleteProduct.useCase';
import { validateRequest } from '@infrastructure/web/middlewares/validateRequest.middleware';
import { asyncHandler } from '@infrastructure/web/middlewares/asyncHandler.middleware';
import { productSchemas } from '@interfaces/validations/product.validation';

const router = express.Router();
const productRepository = new DynamoProductRepository();
const productController = new ProductController(
  new CreateProductUseCase(productRepository),
  new ListProductsUseCase(productRepository),
  new GetProductByIdUseCase(productRepository),
  new UpdateProductUseCase(productRepository),
  new DeleteProductUseCase(productRepository),
);

router.post('/', validateRequest(productSchemas.createProduct), asyncHandler(productController.createProduct));
router.get('/', asyncHandler(productController.listProducts));
router.get('/:id', asyncHandler(productController.getProductById));
router.put('/:id', validateRequest(productSchemas.updateProduct), asyncHandler(productController.updateProduct));
router.delete('/:id', asyncHandler(productController.deleteProduct));

export default router;

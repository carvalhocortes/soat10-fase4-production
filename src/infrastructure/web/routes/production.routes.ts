import express from 'express';
import { DynamoOrderRepository } from '@infrastructure/db/repositories/OrderRepository.db';
import { validateRequest } from '@infrastructure/web/middlewares/validateRequest.middleware';
import { asyncHandler } from '@infrastructure/web/middlewares/asyncHandler.middleware';
import { orderSchemas } from '@interfaces/validations/order.validation';
import { OrderController } from '@interfaces/controllers/order.controller';
import { UpdateProductionStatusUseCase } from '@application/use-cases/order/UpdateProductionStatus.useCase';

const router = express.Router();
const orderRepository = new DynamoOrderRepository();
const orderController = new OrderController(new UpdateProductionStatusUseCase(orderRepository));

router.post(
  'order/:id',
  validateRequest(orderSchemas.updateOrderProductionStatus),
  asyncHandler(orderController.updateOrderStatus),
);

export default router;

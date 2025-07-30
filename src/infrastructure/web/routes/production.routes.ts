import express from 'express';
import { TypeORMOrderRepository } from '@infrastructure/db/repositories/OrderRepository.db';
import { validateRequest } from '@infrastructure/web/middlewares/validateRequest.middleware';
import { asyncHandler } from '@infrastructure/web/middlewares/asyncHandler.middleware';
import { orderSchemas } from '@interfaces/validations/order.validation';
import { OrderController } from '@interfaces/controllers/order.controller';
import { UpdateProductionStatusUseCase } from '@application/use-cases/order/UpdateProductionStatus.useCase';
import { SnsPublisher } from '@infrastructure/external/snsPublisher';

const topicArn = process.env.SNS_PRODUCTION_TOPIC_ARN || '';

const router = express.Router();
const snsPublisher = new SnsPublisher(topicArn);
const orderRepository = new TypeORMOrderRepository();
const orderController = new OrderController(new UpdateProductionStatusUseCase(orderRepository, snsPublisher));

router.post(
  'order/:id',
  validateRequest(orderSchemas.updateOrderProductionStatus),
  asyncHandler(orderController.updateOrderStatus),
);

router.get('order', async (req, res) => {
  res.status(200).json({
    status: 'OK',
  });
});

export default router;

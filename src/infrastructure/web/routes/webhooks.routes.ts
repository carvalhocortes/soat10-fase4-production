import express from 'express';
import { DynamoOrderRepository } from '@infrastructure/db/repositories/OrderRepository.db';
import { validateRequest } from '@infrastructure/web/middlewares/validateRequest.middleware';
import { asyncHandler } from '@infrastructure/web/middlewares/asyncHandler.middleware';
import { webhookSchemas } from '@interfaces/validations/webhook.validation';
import { PaymentWebhookController } from '@interfaces/controllers/webhook.controller';
import { UpdateOrderPaymentStatusUseCase } from '@application/use-cases/payment/UpdateOrderPaymentStatus.useCase';

const router = express.Router();
const orderRepository = new DynamoOrderRepository();
const whController = new PaymentWebhookController(new UpdateOrderPaymentStatusUseCase(orderRepository));

router.post(
  '/payment/:id',
  validateRequest(webhookSchemas.paymentWebhook),
  asyncHandler(whController.handlePaymentNotification),
);

export default router;

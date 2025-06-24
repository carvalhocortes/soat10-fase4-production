import express from 'express';
import { DynamoOrderRepository } from '@infrastructure/db/repositories/OrderRepository.db';
import { DynamoProductRepository } from '@infrastructure/db/repositories/ProductRepository.db';
import { DynamoCustomerRepository } from '@infrastructure/db/repositories/CustomerRepository.db';
import { DynamoCounterRepository } from '@infrastructure/db/repositories/CounterRepository.db';
import { OrderController } from '@interfaces/controllers/order.controller';
import { CreateOrderUseCase } from '@application/use-cases/order/CreateOrder.useCase';
import { ListOrdersUseCase } from '@application/use-cases/order/ListOrders.useCase';
import { GetOrderByIdUseCase } from '@application/use-cases/order/GetOrderById.useCase';
import { GetOrderByNumberUseCase } from '@application/use-cases/order/GetOrderByNumber.useCase';
import { UpdateOrderStatusUseCase } from '@application/use-cases/order/UpdateOrderStatus.useCase';
import { DeleteOrderUseCase } from '@application/use-cases/order/DeleteOrder.useCase';
import { FakePaymentGateway } from '@infrastructure/external/payment/gateway';
import { validateRequest } from '@infrastructure/web/middlewares/validateRequest.middleware';
import { asyncHandler } from '@infrastructure/web/middlewares/asyncHandler.middleware';
import { orderSchemas } from '@interfaces/validations/order.validation';

const router = express.Router();
const orderRepository = new DynamoOrderRepository();
const productRepository = new DynamoProductRepository();
const customerRepository = new DynamoCustomerRepository();
const counterRepository = new DynamoCounterRepository();
const paymentGateway = new FakePaymentGateway();
const orderController = new OrderController(
  new CreateOrderUseCase(orderRepository, productRepository, customerRepository, counterRepository, paymentGateway),
  new ListOrdersUseCase(orderRepository),
  new GetOrderByIdUseCase(orderRepository),
  new GetOrderByNumberUseCase(orderRepository),
  new UpdateOrderStatusUseCase(orderRepository),
  new DeleteOrderUseCase(orderRepository),
);

router.post('/', validateRequest(orderSchemas.createOrder), asyncHandler(orderController.createOrder));
router.get('/', asyncHandler(orderController.listOrders));
router.get('/:id', asyncHandler(orderController.getOrderById));
router.delete('/:id', asyncHandler(orderController.deleteOrder));
router.get('/number/:orderNumber', asyncHandler(orderController.getOrderByNumber));
router.patch(
  '/:id/status',
  validateRequest(orderSchemas.updateOrderStatus),
  asyncHandler(orderController.updateOrderStatus),
);

export default router;

import express from 'express';
import { DynamoCustomerRepository } from '@infrastructure/db/repositories/CustomerRepository.db';
import { CustomerController } from '@interfaces/controllers/customer.controller';
import { CreateCustomerUseCase } from '@application/use-cases/customer/CreateCustomer.useCase';
import { ListCustomersUseCase } from '@application/use-cases/customer/ListCustomers.useCase';
import { GetCustomerByCpfUseCase } from '@application/use-cases/customer/GetCustomerByCpf.useCase';
import { validateRequest } from '@infrastructure/web/middlewares/validateRequest.middleware';
import { asyncHandler } from '@infrastructure/web/middlewares/asyncHandler.middleware';
import { customerSchemas } from '@interfaces/validations/customer.validation';

const router = express.Router();
const customerRepository = new DynamoCustomerRepository();
const customerController = new CustomerController(
  new CreateCustomerUseCase(customerRepository),
  new ListCustomersUseCase(customerRepository),
  new GetCustomerByCpfUseCase(customerRepository),
);

router.post('/', validateRequest(customerSchemas.createCustomer), asyncHandler(customerController.createCustomer));
router.get('/', asyncHandler(customerController.listCustomers));
router.get('/cpf/:cpf', asyncHandler(customerController.getCustomerByCpf));

export default router;

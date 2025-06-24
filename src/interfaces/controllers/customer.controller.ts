import { Request, Response } from 'express';
import { CreateCustomerUseCase } from '@application/use-cases/customer/CreateCustomer.useCase';
import { ListCustomersUseCase } from '@application/use-cases/customer/ListCustomers.useCase';
import { GetCustomerByCpfUseCase } from '@application/use-cases/customer/GetCustomerByCpf.useCase';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { CreateCustomerDTO } from '@application/dto/customer/CreateCustomer.dto';

export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly listCustomersUseCase: ListCustomersUseCase,
    private readonly getCustomerByCpfUseCase: GetCustomerByCpfUseCase,
  ) {}

  createCustomer = async (req: Request, res: Response): Promise<void> => {
    const dto = CreateCustomerDTO.create(req);
    const customer = await this.createCustomerUseCase.execute(dto);
    res.status(201).json(customer);
  };

  getCustomerByCpf = async ({ params }: Request, res: Response): Promise<void> => {
    const customer = await this.getCustomerByCpfUseCase.execute(params.cpf);
    if (!customer) throw new NotFoundError(`Client with CPF ${params.cpf} not found`);
    res.json(customer);
  };

  listCustomers = async (_: Request, res: Response): Promise<void> => {
    const customers = await this.listCustomersUseCase.execute();
    res.json(customers);
  };
}

import { Customer } from '@core/entities/customer.entity';
import { CustomerRepository } from '@interfaces/gateways/CustomerRepository.gateway';

export class ListCustomersUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }
}

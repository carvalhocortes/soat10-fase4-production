import { Customer } from '@core/entities/customer.entity';
import { CustomerRepository } from '@interfaces/gateways/CustomerRepository.gateway';

export class GetCustomerByCpfUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(cpf: string): Promise<Customer | null> {
    return this.customerRepository.findByCpf(cpf);
  }
}

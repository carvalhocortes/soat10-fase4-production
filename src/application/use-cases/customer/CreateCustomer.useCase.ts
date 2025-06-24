import { CreateCustomerDTO } from '@application/dto/customer/CreateCustomer.dto';
import { Customer } from '@core/entities/customer.entity';
import { CustomerRepository } from '@interfaces/gateways/CustomerRepository.gateway';

export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(dto: CreateCustomerDTO): Promise<Customer> {
    const customerExists = await this.customerRepository.findByCpf(dto.cpf);

    if (customerExists) {
      return customerExists;
    }

    const customer = Customer.create(dto);

    return this.customerRepository.save(customer);
  }
}

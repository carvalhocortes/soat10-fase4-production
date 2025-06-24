import { Customer } from '@core/entities/customer.entity';

export interface CustomerRepository {
  save(customer: Customer): Promise<Customer>;
  findAll(): Promise<Customer[]>;
  findByCpf(cpf: string): Promise<Customer | null>;
  findById(id: string): Promise<Customer | null>;
}

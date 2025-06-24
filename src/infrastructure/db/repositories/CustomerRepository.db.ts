import { CustomerRepository } from '@interfaces/gateways/CustomerRepository.gateway';
import { Customer, CustomerProps } from '@core/entities/customer.entity';
import { CustomerModel } from '@infrastructure/db/models/customer.model';

export class DynamoCustomerRepository implements CustomerRepository {
  async save(customer: Customer): Promise<Customer> {
    const newCustomer = new CustomerModel(customer);
    await newCustomer.save();
    return Customer.reconstruct(this.toCustomerProps(newCustomer));
  }

  async findAll(): Promise<Customer[]> {
    const customers = await CustomerModel.scan().exec();
    if (customers.length === 0) {
      return [];
    }
    return customers.map((customer) => Customer.reconstruct(this.toCustomerProps(customer)));
  }

  async findByCpf(cpf: string): Promise<Customer | null> {
    const customer = await CustomerModel.query('cpf').eq(cpf).using('cpf-index').exec();
    if (customer.count === 0) {
      return null;
    }
    return Customer.reconstruct(this.toCustomerProps(customer[0]));
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = await CustomerModel.get(id);
    if (!customer) {
      return null;
    }
    return Customer.reconstruct(this.toCustomerProps(customer));
  }

  private toCustomerProps(document: CustomerProps): CustomerProps {
    return {
      id: document.id,
      cpf: document.cpf,
      name: document.name,
      email: document.email,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}

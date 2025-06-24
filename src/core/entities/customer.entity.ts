import { ValidationError } from '@shared/errors/ValidationError';
import { v4 as uuidv4 } from 'uuid';

export interface CustomerProps {
  id?: string;
  cpf: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Customer {
  public readonly id?: string;
  public readonly cpf: string;
  public readonly name: string;
  public readonly email: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  private constructor(props: CustomerProps) {
    this.id = props.id || uuidv4();
    this.cpf = props.cpf;
    this.name = props.name;
    this.email = props.email;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  public static create(props: Omit<CustomerProps, 'createdAt' | 'updatedAt'>): Customer {
    this.validate(props);

    return new Customer({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static reconstruct(props: CustomerProps): Customer {
    return new Customer(props);
  }

  public toJSON(): CustomerProps {
    return {
      id: this.id,
      cpf: this.cpf,
      name: this.name,
      email: this.email,
    };
  }

  private static validate(props: Omit<CustomerProps, 'id' | 'createdAt' | 'updatedAt'>): void {
    if (!props.cpf) {
      throw new ValidationError('CPF is required');
    }

    if (!props.name) {
      throw new ValidationError('Name is required');
    }

    if (!props.email) {
      throw new ValidationError('Email is required');
    }
  }
}

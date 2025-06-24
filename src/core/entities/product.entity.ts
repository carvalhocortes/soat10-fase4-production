import { ValidationError } from '@shared/errors/ValidationError';
import { v4 as uuidv4 } from 'uuid';

export interface ProductProps {
  id?: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: Array<string>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product {
  public readonly id?: string;
  public readonly name: string;
  public readonly category: string;
  public readonly price: number;
  public readonly description: string;
  public readonly images: Array<string>;
  public readonly createdAt: Date;
  public updatedAt: Date;

  private constructor(props: ProductProps) {
    this.id = props.id || uuidv4();
    this.name = props.name;
    this.category = props.category;
    this.price = props.price;
    this.description = props.description;
    this.images = props.images;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  public static create(props: Omit<ProductProps, 'createdAt' | 'updatedAt'>): Product {
    this.validate(props);

    return new Product({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static update(props: Omit<ProductProps, 'updatedAt'>): Product {
    this.validate(props);

    return new Product({
      ...props,
      updatedAt: new Date(),
    });
  }

  public static reconstruct(props: ProductProps): Product {
    return new Product(props);
  }

  public toJSON(): ProductProps {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      price: this.price,
      description: this.description,
      images: this.images,
    };
  }

  private static validate(props: Omit<ProductProps, 'id' | 'createdAt' | 'updatedAt'>): void {
    if (!props.name) {
      throw new ValidationError('Name is required');
    }

    if (!props.category) {
      throw new ValidationError('Category is required');
    }

    if (!props.price) {
      throw new ValidationError('Price is required');
    }

    if (!props.description) {
      throw new ValidationError('Description is required');
    }
  }
}

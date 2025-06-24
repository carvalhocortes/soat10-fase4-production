import { ValidationError } from '@shared/errors/ValidationError';

export interface CounterProps {
  name: string;
  seq: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Counter {
  public readonly name: string;
  public readonly seq: number;
  public readonly createdAt: Date;
  public updatedAt: Date;

  private constructor(props: CounterProps) {
    this.seq = props.seq;
    this.name = props.name;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  public static create(props: Omit<CounterProps, 'seq'> & { seq?: number }): Counter {
    this.validate(props);

    return new Counter({
      name: props.name,
      seq: props.seq || 1,
    });
  }

  public static reconstruct(props: CounterProps): Counter {
    return new Counter(props);
  }

  public toJSON(): CounterProps {
    return {
      name: this.name,
      seq: this.seq,
    };
  }

  private static validate(props: { name: string; seq?: number }): void {
    if (!props.name || props.name.trim().length === 0) {
      throw new ValidationError('Counter name cannot be empty');
    }

    if (props.seq && (props.seq < 1 || !Number.isInteger(props.seq))) {
      throw new ValidationError('Sequence must be a positive integer');
    }
  }
}

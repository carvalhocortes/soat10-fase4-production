import { Counter } from '@core/entities/counter.entity';

export interface CounterRepository {
  getNextSequenceNumber(name: string): Promise<Counter | null>;
}

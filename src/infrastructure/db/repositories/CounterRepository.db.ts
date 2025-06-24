import { CounterRepository } from '@interfaces/gateways/CounterRepository.gateway';
import { Counter } from '@core/entities/counter.entity';
import { CounterModel } from '@infrastructure/db/models/counter.model';

export class DynamoCounterRepository implements CounterRepository {
  async getNextSequenceNumber(name: string): Promise<Counter | null> {
    const counter = await CounterModel.get(name);
    if (!counter) {
      return null;
    }
    counter.seq = counter.seq + 1;
    await counter.save();
    return Counter.reconstruct(counter);
  }
}

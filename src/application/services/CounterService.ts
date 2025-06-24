import { CounterRepository } from '@interfaces/gateways/CounterRepository.gateway';

export class CounterService {
  constructor(private readonly counterRepository: CounterRepository) { }

  async getNextSequenceNumber(name: string): Promise<number> {
    const counter = await this.counterRepository.getNextSequenceNumber(name);
    return counter?.seq || 1;
  }
}

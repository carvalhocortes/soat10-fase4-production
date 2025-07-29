import { SqsListener } from '@infrastructure/external/sqsListener';
import { ProcessOrderCreatedUseCase } from '@application/use-cases/order/ProcessOrderCreated.useCase';
import { TypeORMOrderRepository } from '@infrastructure/db/repositories/OrderRepository.db';
import { SnsPublisher } from '@infrastructure/external/snsPublisher';

export function createSqsListener(queueUrl: string, topicArn: string): SqsListener {
  const orderRepository = new TypeORMOrderRepository();
  const snsPublisher = new SnsPublisher(topicArn);
  const useCase = new ProcessOrderCreatedUseCase(orderRepository, snsPublisher);
  return new SqsListener(queueUrl, useCase);
}

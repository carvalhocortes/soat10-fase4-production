import { SqsListener } from '@infrastructure/external/sqsListener';
import { ProcessPaymentOnOrderCreatedUseCase } from '@application/use-cases/payment/ProcessPaymentOnOrderCreated.useCase';
import { DynamoPaymentRepository } from '@infrastructure/db/repositories/PaymentRepository.db';
import { SnsPublisher } from '@infrastructure/external/snsPublisher';

export function createSqsListener(queueUrl: string, topicArn: string): SqsListener {
  const paymentRepository = new DynamoPaymentRepository();
  const snsPublisher = new SnsPublisher(topicArn);
  const useCase = new ProcessPaymentOnOrderCreatedUseCase(paymentRepository, snsPublisher);
  return new SqsListener(queueUrl, useCase);
}

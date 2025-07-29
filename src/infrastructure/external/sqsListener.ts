import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { ProcessOrderCreatedUseCase } from '@application/use-cases/order/ProcessOrderCreated.useCase';

export class SqsListener {
  private sqs: SQSClient;
  private queueUrl: string;
  private useCase: ProcessOrderCreatedUseCase;

  constructor(queueUrl: string, useCase: ProcessOrderCreatedUseCase) {
    this.sqs = new SQSClient({});
    this.queueUrl = queueUrl;
    this.useCase = useCase;
  }

  async listen(): Promise<void> {
    const params = {
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20,
    };
    const response = await this.sqs.send(new ReceiveMessageCommand(params));
    if (response.Messages) {
      for (const message of response.Messages) {
        try {
          const { eventType, payload } = JSON.parse(message.Body || '{}');
          if (eventType === 'ORDER_CREATED') {
            await this.useCase.execute({
              orderId: payload.orderId,
              amount: payload.amount,
            });
          }
          await this.sqs.send(
            new DeleteMessageCommand({
              QueueUrl: this.queueUrl,
              ReceiptHandle: message.ReceiptHandle!,
            }),
          );
        } catch (err) {
          console.error('Error processing message:', err);
        }
      }
    }
  }
}

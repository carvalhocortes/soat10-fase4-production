import express, { Application } from 'express';
import { env } from '@config/env';
import routes from '@infrastructure/web/routes';
import errorHandler from '@infrastructure/web/middlewares/errorHandler.middleware';
import { createSqsListener } from '@infrastructure/external/sqsListenerFactory';

class Server {
  private app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    this.app.use(routes);

    this.app.use('*', (req, res) => {
      res.status(404).json({
        message: 'Route not found',
        code: 'NOT_FOUND',
      });
    });
  }

  private setupErrorHandler(): void {
    this.app.use(errorHandler);
  }

  public start(): void {
    this.app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
      const queueUrl =
        process.env.SQS_PRODUCTION_QUEUE_URL || 'https://sqs.us-west-2.amazonaws.com/548226336065/sqs-production';
      const topicArn = process.env.SNS_PRODUCTION_TOPIC_ARN || 'arn:aws:sns:us-west-2:548226336065:sns-production';
      const sqsListener = createSqsListener(queueUrl, topicArn);
      console.log(`🔗 Listening for messages on SQS queue: ${queueUrl}`);
      const pollMessages = async () => {
        console.log('Starting to listen for SQS messages...');
        while (true) {
          await sqsListener.listen();
        }
      };
      pollMessages();
    });
  }
}

export default Server;

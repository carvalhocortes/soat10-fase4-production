import express, { Application } from 'express';
import { env } from '@config/env';
import routes from '@infrastructure/web/routes';
import errorHandler from '@infrastructure/web/middlewares/errorHandler.middleware';

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
  }

  private setupErrorHandler(): void {
    this.app.use(errorHandler);
  }

  public start(): void {
    this.app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
    });
  }
}

export default Server;

import { database } from '@infrastructure/db/config/database.config';
import Server from '@infrastructure/web/server';

const start = async () => {
  try {
    database.getInstance();
    await database.connect();
    const server = new Server();
    server.start();
  } catch (error) {
    console.log('Failed to start application:', error);
    process.exit(1);
  }
};

start();

const shutdown = async () => {
  await database.disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

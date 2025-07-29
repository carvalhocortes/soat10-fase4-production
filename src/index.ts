import { AppDataSource } from '@infrastructure/db/config/database.config';
import Server from '@infrastructure/web/server';

let isConnected = false;

const start = async () => {
  try {
    await AppDataSource.initialize();
    isConnected = true;
    console.log('✅ Conectado ao MySQL com TypeORM');
    const server = new Server();
    server.start();
  } catch (error) {
    console.log('❌ Falha ao iniciar aplicação:', error);
    process.exit(1);
  }
};

start();

const shutdown = async () => {
  if (!isConnected) {
    console.log('❌ Aplicação não está conectada ao banco de dados.');
    return;
  }
  await AppDataSource.destroy();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

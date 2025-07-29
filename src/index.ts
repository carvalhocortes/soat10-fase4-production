import { AppDataSource } from '@infrastructure/db/config/database.config';
import Server from '@infrastructure/web/server';

const start = async () => {
  try {
    console.log('teste');
    console.log('env', JSON.stringify(process.env, null, 2));
    console.log('');
    console.log('Iniciando conexão com o banco de dados...');
    console.log('');
    console.log('');
    console.log('teste fim');
    await AppDataSource.initialize();
    console.log('Conectado ao MySQL com TypeORM');
    const server = new Server();
    server.start();
  } catch (error) {
    console.log('Falha ao iniciar aplicação:', error);
    process.exit(1);
  }
};

start();

const shutdown = async () => {
  await AppDataSource.destroy();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

import { AppDataSource } from '@infrastructure/db/config/database.config';
import Server from '@infrastructure/web/server';

import ormconfig from '../ormconfig';

const start = async () => {
  try {
    console.log('');
    console.log('');
    console.log('');
    console.log(JSON.stringify(ormconfig, null, 2));
    console.log('Iniciando conexão com o banco de dados...');
    console.log('');
    console.log('');
    console.log('');
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

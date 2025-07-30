import { AppDataSource } from '@infrastructure/db/config/database.config';
import Server from '@infrastructure/web/server';

// let isConnected = false;

const start = async () => {
  try {
    console.log('🔗 Iniciando conexão com o Postgres...');
    await AppDataSource.initialize();
    // isConnected = true;
    console.log('✅ Conectado ao Postgres com TypeORM');
    const server = new Server();
    server.start();
  } catch (error) {
    console.log('❌ Falha ao iniciar aplicação:', error);
    setTimeout(() => {
      process.exit(1);
    }, 100);
  }
};

start();

// const shutdown = async () => {
//   if (!isConnected) {
//     console.log('❌ Aplicação não está conectada ao banco de dados.');
//     process.exit(0);
//   }
//   await AppDataSource.destroy();
//   process.exit(0);
// };

// process.on('SIGINT', shutdown);
// process.on('SIGTERM', shutdown);

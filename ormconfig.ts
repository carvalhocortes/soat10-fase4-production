import { DataSourceOptions } from 'typeorm';
import { Order } from './src/core/entities/order.entity';
import { env } from '@config/env';

// Debug das variáveis de ambiente
console.log('Database Environment Variables:', {
  POSTGRES_HOST: env.POSTGRES_HOST,
  POSTGRES_PORT: env.POSTGRES_PORT,
  POSTGRES_USER: env.POSTGRES_USER,
  POSTGRES_DB: env.POSTGRES_DB,
  // Não logar a senha em produção
  POSTGRES_PASSWORD: env.POSTGRES_PASSWORD ? '[SET]' : '[NOT SET]',
});

const config: DataSourceOptions = {
  type: 'postgres',
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  entities: [Order],
  synchronize: false,
  migrations: ['src/infrastructure/db/migrations/*.ts'],
  ssl: {
    rejectUnauthorized: false,
  },
};

export default config;

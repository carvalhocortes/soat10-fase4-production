import { DataSourceOptions } from 'typeorm';
import { Order } from './src/core/entities/order.entity';
import { env } from '@config/env';

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
};

export default config;

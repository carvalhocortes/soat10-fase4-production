import { DataSourceOptions } from 'typeorm';
import { Order } from './src/core/entities/order.entity';

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || '',
  database: process.env.POSTGRES_DB || 'production',
  entities: [Order],
  synchronize: false,
  migrations: ['src/infrastructure/db/migrations/*.ts'],
};

export default config;

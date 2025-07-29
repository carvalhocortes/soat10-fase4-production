import { DataSourceOptions } from 'typeorm';
import { Order } from './src/core/entities/order.entity';

const config: DataSourceOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT) || 3306,
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'production',
  entities: [Order],
  synchronize: false,
  migrations: ['src/infrastructure/db/migrations/*.ts'],
};

export default config;

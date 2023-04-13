import { registerAs } from '@nestjs/config';
import { Product } from 'src/products/entities/product.entity';

export default registerAs('database', () => {
  return {
    type: 'postgres',
    logging: true,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    autoLoadEntities: true,
    synchronize: true, // Disable on production
    entities: [Product],
  };
});

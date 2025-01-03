import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

console.log('DATABASE_HOST:', configService.get<string>('DATABASE_HOST'));
const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: Number(configService.get<string>('DATABASE_PORT')),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASS'),
  database: configService.get<string>('DATABASE_NAME'),
  synchronize: false,
  entities: ['**/*.entity.ts'],
  migrations: ['src/database/migrations/*-migration.ts'],
  migrationsRun: false,
  logging: true,
  ssl: configService.get<string>('NODE_ENV') === 'production',
  extra: {
    ssl:
      configService.get<string>('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : null,
  },
});

export default AppDataSource;

import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { join } from 'path';

describe('ConfigService', () => {
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: join(__dirname, '../../.env.test'),
          isGlobal: true,
        }),
      ],
      providers: [ConfigService],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(configService).toBeDefined();
  });

  it('should return correct DATABASE_HOST string', () => {
    const databaseHost = configService.get<string>('DATABASE_HOST');
    expect(databaseHost).toBe('localhost');
  });

  it('should return correct DATABASE_PORT number', () => {
    expect(Number(configService.get<number>('DATABASE_PORT'))).toBe(5432);
  });

  it('should return undefined for undefined key', () => {
    expect(configService.get<string>('RANDOM_KEY')).toBeUndefined();
  });
});

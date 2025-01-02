import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionsService } from './encryptions.service';
import * as bcrypt from 'bcrypt';

describe('EncryptionsService', () => {
  let service: EncryptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptionsService],
    }).compile();

    service = module.get<EncryptionsService>(EncryptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should return a hashed password and has valid hash', async () => {
      const password = 'dummyPassword!123';
      const hash = await service.hashPassword(password);
      expect(hash).not.toBe(password);

      const isValidHash = await service.comparePassword(password, hash);
      expect(isValidHash).toBe(true);
    });
  });

  describe('comparePassword', () => {
    const saltRounds: number = 10;

    it('should return true if password and hash are valid', async () => {
      const password = 'dummyPassword!123';
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const isValid = await service.comparePassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should return false if password and hash are invalid', async () => {
      const password = 'dummyPassword!123';
      const wrongPassword = 'wrongPassword!123';
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const isValid = await service.comparePassword(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });
  });
});

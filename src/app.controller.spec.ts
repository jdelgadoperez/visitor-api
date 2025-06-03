import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { RedisService } from './redis/redis.service';

describe('AppController', () => {
  let appController: AppController;
  let redisService: RedisService;

  beforeEach(async () => {
    const mockRedisService = {
      incrementVisitorCount: jest.fn().mockResolvedValue(1),
      storeVisitorData: jest.fn().mockResolvedValue(undefined),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    redisService = app.get<RedisService>(RedisService);
  });

  describe('getVisitorCount', () => {
    it('should return visitor count', async () => {
      const result = await appController.getVisitorCount();
      expect(result).toBe('Visitor count: 1');
      expect(redisService.incrementVisitorCount).toHaveBeenCalled();
    });
  });

  describe('recordVisitor', () => {
    it('should record visitor data', async () => {
      const createVisitorDto = { ipAddress: '192.168.1.1' };
      const result = await appController.recordVisitor(createVisitorDto);

      expect(result.message).toBe('Visitor data recorded successfully');
      expect(result.ipAddress).toBe('192.168.1.1');
      expect(result.timestamp).toBeDefined();
      expect(redisService.storeVisitorData).toHaveBeenCalledWith('192.168.1.1', result.timestamp);
    });
  });
});

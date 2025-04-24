import { Controller, Get } from '@nestjs/common';
import { RedisService } from './redis/redis.service';

@Controller()
export class AppController {
  constructor(private readonly redisService: RedisService) { }

  @Get()
  async getVisitorCount(): Promise<string> {
    const count = await this.redisService.incrementVisitorCount();
    return `Visitor count: ${count}`;
  }
}

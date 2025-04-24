import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;

  async onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    });
  }

  async incrementVisitorCount(): Promise<number> {
    return await this.client.incr('visitor_count');
  }

  async getVisitorCount(): Promise<number> {
    const count = await this.client.get('visitor_count');
    return count ? parseInt(count, 10) : 0;
  }
}

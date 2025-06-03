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

  async storeVisitorData(ipAddress: string, timestamp: string): Promise<void> {
    const visitorKey = `visitor:${ipAddress}:${Date.now()}`;

    // Store visitor data as a hash
    await this.client.hset(visitorKey, {
      ipAddress,
      timestamp,
    });

    // Add to a sorted set for easy querying by timestamp
    await this.client.zadd('visitors_by_time', Date.now(), visitorKey);
  }

  async getVisitorData(ipAddress: string): Promise<Array<{ ipAddress: string; timestamp: string }>> {
    const pattern = `visitor:${ipAddress}:*`;
    const keys = await this.client.keys(pattern);

    const visitorData = [];
    for (const key of keys) {
      const data = await this.client.hgetall(key);
      if (data.ipAddress && data.timestamp) {
        visitorData.push({
          ipAddress: data.ipAddress,
          timestamp: data.timestamp,
        });
      }
    }

    return visitorData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}

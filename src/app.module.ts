import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [RedisService],
})
export class AppModule { }

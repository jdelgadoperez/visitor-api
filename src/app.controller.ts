import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateVisitorDto, VisitorResponseDto } from './dto/visitor.dto';
import { RedisService } from './redis/redis.service';

@Controller()
export class AppController {
  constructor(private readonly redisService: RedisService) { }

  @Get()
  async getVisitorCount(): Promise<string> {
    const count = await this.redisService.incrementVisitorCount();
    const value = `Visitor count: ${count}`
    console.log(value)
    return value;
  }

  @Post('visitor')
  async recordVisitor(@Body() createVisitorDto: CreateVisitorDto): Promise<VisitorResponseDto> {
    const { ipAddress } = createVisitorDto;
    const timestamp = new Date().toISOString();

    await this.redisService.storeVisitorData(ipAddress, timestamp);

    return {
      message: 'Visitor data recorded successfully',
      ipAddress,
      timestamp,
    };
  }
}

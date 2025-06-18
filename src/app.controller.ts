import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { CreateVisitorDto, VisitorResponseDto } from './dto/visitor.dto';
import { RedisService } from './redis/redis.service';

@Controller()
export class AppController {
  constructor(private readonly redisService: RedisService) { }

  @Get()
  async getVisitorCount(): Promise<{ code: HttpStatus, message: string, count: string }> {
    const count = await this.redisService.incrementVisitorCount();
    const result = {
      code: HttpStatus.OK,
      message: 'Visitor count',
      count: count.toString(),
    }
    console.log('getVisitorCount ==>>', result)
    return result;
  }

  @Post('visitor')
  async recordVisitor(@Body() createVisitorDto: CreateVisitorDto): Promise<VisitorResponseDto> {
    const { ipAddress } = createVisitorDto;
    const timestamp = new Date().toISOString();
    await this.redisService.storeVisitorData(ipAddress, timestamp);
    const result = {
      code: HttpStatus.CREATED,
      message: 'Visitor data recorded successfully',
      ipAddress,
      timestamp,
    }
    console.log('recordVisitor ==>>', result)
    return result;
  }
}

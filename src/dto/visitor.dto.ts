import { Transform } from 'class-transformer';
import { IsIP, IsNotEmpty, IsString } from 'class-validator';

export class CreateVisitorDto {
  @IsNotEmpty({ message: 'IP address is required' })
  @IsString({ message: 'IP address must be a string' })
  @IsIP(undefined, { message: 'Invalid IP address format' })
  @Transform(({ value }) => value?.trim())
  ipAddress: string;
}

export class VisitorResponseDto {
  code: number;
  message: string;
  ipAddress: string;
  timestamp: string;
}

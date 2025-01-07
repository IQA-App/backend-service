import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { BaseUserDto } from './base-use.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(BaseUserDto) {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Password123#',
    description:
      'Password must be at least 6 characters long and no more than 20 characters long! Password must contain at least one digit and at least one lowercase letter and at least one uppercase letter!',
  })
  password: string;
}

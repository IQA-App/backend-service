import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  MaxLength,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description:
      'Password must be at least 6 characters long and no more than 20 characters long! Password must contain at least one digit and  at least one lowercase letter and at least one uppercase letter!',
  })
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters!' })
  @MaxLength(20, { message: 'Password must be at most 20 characters long!' })
  @Matches(/.*\d/, {
    message: 'Password must contains at least one digit!',
  })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter!',
  })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter!',
  })
  @Matches(/[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/, {
    message: 'Password must contain at least one special character!',
  })
  password: string;
}

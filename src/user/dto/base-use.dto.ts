import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123#',
    description:
      'Password must be at least 6 characters long and no more than 20 characters long! Password must contain at least one digit and  at least one lowercase letter and at least one uppercase letter!',
  })
  @MinLength(6, { message: 'Password must be at least 6 characters!' })
  @MaxLength(20, { message: 'Password must be at most 20 characters long!' })
  @Matches(/.*\d/, {
    message: 'Password must contain at least one digit!',
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

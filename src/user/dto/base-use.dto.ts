import {
  IsEmail,
  isNotEmpty,
  IsNotEmpty,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PasswordValidation } from '../validators/password-validation';

export class BaseUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Provide valid email!' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Password123#',
    description:
      'Password must be at least 6 characters long and no more than 20 characters long! Password must contain at least one digit and  at least one lowercase letter and at least one uppercase letter! Password can not contain white spaces and non latin letters',
  })
  @Validate(PasswordValidation)
  password: string;
}

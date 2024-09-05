import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;


    @ApiProperty({ example: 'password123', description: 'Password must be at least 6 characters long' })
    @MinLength(6, { message: 'Password must be more than 6 symbols !' })
    @MaxLength(20, { message: 'Password must be at most 20 characters long' })
    
    password: string;
}

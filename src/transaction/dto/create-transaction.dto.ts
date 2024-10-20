import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateTransactionDto {
  @ApiProperty({
    example: 'title',
    description: `Title must be a string!`,
  })
  
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsString()
  @MinLength(6)
  type: 'expense' | 'income';

  @IsNotEmpty()
  category: Category;

  @IsOptional()
  // @IsNotEmpty()
  user?: User;
}

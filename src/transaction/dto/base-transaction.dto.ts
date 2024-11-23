import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { IsEnum } from 'class-validator';

export enum TransactionType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

export class BaseTransactionDto {
  @ApiProperty({
    example: 'title',
    description: `Title must be a string!`,
  })
  @IsNotEmpty()
  @MinLength(6, { message: 'Title must be at least 6 characters!' })
  @MaxLength(20, { message: 'Title must be at most 20 characters long!' })
  title: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsEnum(TransactionType, {
    message: 'Type must be either "expense" or "income"',
  })
  type: TransactionType;

  @IsNotEmpty()
  @IsNumber({}, { message: 'Category must be a number!' })
  category: Category;

  @IsOptional()
  user?: User;
}

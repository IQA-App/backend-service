import { BaseTransactionDto } from './base-transaction.dto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class UpdateTransactionDto extends PartialType(BaseTransactionDto) {
  @ApiProperty({
    example: 'title',
    description: 'Title must be a string!',
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Title cannot be empty or whitespace!' })
  title?: string;

  @IsOptional()
  user?: User;
}

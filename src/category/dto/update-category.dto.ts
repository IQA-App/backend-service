import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({
    example: 'title',
    description: 'Title must be a string!',
  })
  @IsNotEmpty()
  title: string;

  @IsOptional()
  user?: User;
}

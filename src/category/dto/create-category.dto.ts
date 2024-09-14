import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'title',
    description: 'Title must be a string!',
  })
  @IsNotEmpty()
  title: string;

  @IsOptional()
  user?: User;
}

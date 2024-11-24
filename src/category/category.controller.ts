import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorCategoryGuard } from 'src/guard/author.category-guard';
// import { AuthorGuard } from 'src/guard/author.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @ApiTags('category')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create category' })
  create(@Body() createCategoryDto: CreateCategoryDto, @Req() reg) {
    return this.categoryService.create(createCategoryDto, +reg.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiTags('category')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all categories' })
  findAll(@Req() reg) {
    return this.categoryService.findAll(+reg.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AuthorCategoryGuard) //  AuthorGuard allows to do actions if the user owns resources transactions/categories
  @UsePipes(new ValidationPipe())
  @ApiTags('category')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get category by id' })
  // @ApiParam({
  //   name: 'type',
  //   description: `Type must be 'category'`,
  //   required: true,
  //   type: 'String',
  // })
  findOne(@Param('id') id: string) {
    const numericId = Number(id);
    if (!id.trim() || isNaN(numericId) || numericId <= 0) {
      throw new BadRequestException(
        'Ah ah ! The category_id cannot be a whitespace! or the category_id  must be a number! or the category_id  must be a positive number!',
      );
    }
    return this.categoryService.findOne(+id);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard, AuthorCategoryGuard)
  @UsePipes(new ValidationPipe())
  @ApiTags('category')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category by id' })
  // @ApiParam({
  //   name: 'title',
  //   description: `Type must be 'category'`,
  //   required: true,
  //   type: 'String',
  // })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Nischtyaki' },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const numericId = Number(id);
    if (!id.trim() || isNaN(numericId) || numericId <= 0) {
      throw new BadRequestException(
        'Ah ah ! The category_id cannot be a whitespace! or the category_id  must be a number! or the category_id  must be a positive number!',
      );
    }
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, AuthorCategoryGuard)
  @UsePipes(new ValidationPipe())
  @ApiTags('category')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete category by id' })
  // @ApiParam({
  //   name: 'type',
  //   description: `Type must be 'category'`,
  //   required: true,
  //   type: 'String',
  // })
  remove(@Param('id') id: string) {
    const numericId = Number(id);
    if (!id.trim() || isNaN(numericId) || numericId <= 0) {
      throw new BadRequestException(
        'Ah ah ! The category_id cannot be a whitespace! or the category_id  must be a number! or the category_id  must be a positive number!',
      );
    }
    return this.categoryService.remove(+id);
  }
}

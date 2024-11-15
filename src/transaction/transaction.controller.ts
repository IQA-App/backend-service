import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Query,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { title } from 'process';
import { AuthorGuard } from 'src/guard/author.guard';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiTags('transactions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create transaction' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Purchase' },
        amount: { type: 'number', example: 1200 },
        type: { type: 'string', example: 'income' },
        category: { type: 'number', example: 12 },
      },
    },
  })
  create(@Body() createTransactionDto: CreateTransactionDto, @Req() req) {
    const title = createTransactionDto.title;
    if (!title) {
      throw new BadRequestException('Title is required!');
    }

    const pattern = /\s/;
    if (pattern.test(title)) {
      throw new BadRequestException('The title cannot contain whitespace!');
    }

    return this.transactionService.create(createTransactionDto, +req.user.id);
  }

  // url/transactions/pagination?page=1&limit=3
  @Get('pagination')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @ApiTags('transactions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pagination transaction' })
  findAllWithPagination(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 3,
  ) {
    // Parse page and limit to numbers to ensure they are integers
    const pageNumber = Number(page) || 1; // If parsing fails, default to 1
    const limitNumber = Number(limit) || 3; // If parsing fails, default to 3

    return this.transactionService.findAllWithPagination(
      +req.user.id,
      pageNumber,
      limitNumber,
    );
  }

  @Get()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiTags('transactions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all transactions' })
  findAll(@Req() req) {
    return this.transactionService.findAll(+req.user.id);
  }

  //  url/transactions/transaction/1
  //  url/categories/category/1
  @Get(':type/:id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, AuthorGuard) //  AuthorGuard allows to do actions if the user owns resources transactions/categories
  @ApiTags('transactions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get single transaction' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    const pattern = /\s/;
    if (isNaN(id) || pattern.test(id.toString()))
      throw new BadRequestException('Transaction id must be a number!');

    return this.transactionService.findOne(+id);
  }

  @Patch(':type/:id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, AuthorGuard)
  @ApiTags('transactions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update transaction' })
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Req() req,
  ) {
    const title = updateTransactionDto.title;
    if (!title) {
      throw new BadRequestException('Title is required!');
    }

    const category = req.body.category;
    if (!category) {
      throw new BadRequestException('Category is required!');
    }

    const pattern = /\s/;
    if (pattern.test(title)) {
      throw new BadRequestException('The title cannot contain whitespace!');
    }
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @Delete(':type/:id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, AuthorGuard)
  @ApiTags('transactions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete transaction' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.transactionService.remove(id);
  }
}

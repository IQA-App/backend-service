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
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

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
        title: { type: 'string', example: 'March' },
        amount: { type: 'number', example: 1200 },
        type: { type: 'string', example: 'income' },
        category: { type: 'number', example: 12 },
      },
    },
  })
  create(@Body() createTransactionDto: CreateTransactionDto, @Req() req) {
    console.log('- req.user -', req.user);
    console.log('- req.user.id -', req.user.id);
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
      // +req.user.id,
      // +page,
      // +limit,
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

  @Get(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiTags('transactions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get single transaction' })
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiTags('transactions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update transaction' })
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiTags('transactions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete transaction' })
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}

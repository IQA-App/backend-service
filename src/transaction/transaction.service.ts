import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, id: number) {
    const category = await this.categoryService.findOne(
      +createTransactionDto.category,
    );
    if (!category) {
      throw new NotFoundException(
        `Category with id ${createTransactionDto.category} not found!`,
      );
    }
    const newTransaction = {
      title: createTransactionDto.title,
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      category: { id: +createTransactionDto.category }, // category must be exsiting in our db,if categoty doesnt exist in db > fail
      user: { id },
    };

    if (!newTransaction) throw new BadRequestException('Something went wrong');
    return await this.transactionRepository.save(newTransaction);
  }

  async findAll(id: number) {
    const transactions = await this.transactionRepository.find({
      where: {
        user: { id },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: {
        user: true,
        category: true,  
      },
    });
    return transactions;
  }

  async findOne(id: number) {
    const pattern = /\s/;
    if (isNaN(id) || pattern.test(id.toString()))
      throw new BadRequestException('Transaction id must be a number!');

    const transaction = await this.transactionRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
        category: true,
      },
    });

    if (!transaction) throw new NotFoundException('Transaction not found!');
    return transaction;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const pattern = /\s/;
    if (isNaN(id) || pattern.test(id.toString()))
      throw new BadRequestException('Transaction id must be a number!');

    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });
    const category = await this.categoryService.findOne(
      +updateTransactionDto.category,
    );
    if (!category || null) {
      throw new NotFoundException(
        `Category with id ${updateTransactionDto.category} not found!`,
      );
    }

    if (!transaction)
      throw new NotFoundException(`Transaction with id ${id} not found!`);
    await this.transactionRepository.update(id, updateTransactionDto);
    return { message: `Transaction  with transaction_id: ${id} updated!` };
  }

  async remove(id: number) {
    const pattern = /\s/;
    if (isNaN(id) || pattern.test(id.toString()))
      throw new BadRequestException('Transaction id must be a number!');

    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });
    if (!transaction)
      throw new NotFoundException(`Transaction with id ${id} not found!`);
    await this.transactionRepository.delete(id);
    return `This action removes a #${id} transaction`;
  }

  async findAllWithPagination(id: number, page: number, limit: number) {
    const transaction = await this.transactionRepository.find({
      where: {
        user: { id },
      },
      relations: {
        category: true,
        user: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    return transaction;
  }

  async findAllByType(id: number, type: string) {
    if (type !== 'income' && type !== 'expense')
      throw new BadRequestException('Invalid type!');

    const transactions = await this.transactionRepository.find({
      where: {
        user: { id },
        type,
      },
    });

    const total = transactions.reduce((acc, obj) => acc + obj.amount, 0);

    return total;
  }
}

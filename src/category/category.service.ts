import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, id: number) {
    if (typeof createCategoryDto.title !== 'string') {
      throw new BadRequestException('Title must be a string!');
    }

    const isExist = await this.categoryRepository.findBy({
      user: { id },
      title: createCategoryDto.title,
    });

    if (isExist.length)
      throw new BadRequestException(`This category already exists!`);
    const newCategory = {
      title: createCategoryDto.title,
      user: {
        id,
      },
    };
    return await this.categoryRepository.save(newCategory);
  }

  async findAll(id: number) {
    return await this.categoryRepository.find({
      where: {
        user: { id },
      },
      relations: {
        transactions: true,
      },
    });
  }

  async findOne(id: number) {
    const pattern = /\s/;
    if (isNaN(id) || pattern.test(id.toString()))
      throw new BadRequestException('Transaction id must be a number!');

    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        user: true,
        transactions: true,
      },
    });
    if (!category)
      throw new NotFoundException(
        `Category with category_id: ${id} not found!`,
      );

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const pattern = /\s/;
    if (isNaN(id) || pattern.test(id.toString()))
      throw new BadRequestException('Transaction id must be a number!');

    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category)
      throw new NotFoundException(
        `Category with category_id: ${id} not found!`,
      );
    await this.categoryRepository.update(id, updateCategoryDto);

    return { message: `Category with category_id: ${id} updated!` };
  }

  async remove(id: number) {
    const pattern = /\s/;
    if (isNaN(id) || pattern.test(id.toString()))
      throw new BadRequestException('Transaction id must be a number!');

    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category)
      throw new NotFoundException(
        `Category with category_id: ${id} not found!`,
      );
    await this.categoryRepository.delete(id);

    return `Category with category_id: ${id} deleted!`;
  }
}

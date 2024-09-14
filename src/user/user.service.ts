import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existUser) throw new BadRequestException('This email already exists!');
    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password),
    });

    const access_token = this.jwtService.sign({
      id: user.id,
      email: createUserDto.email,
    });

    return { user, access_token };
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException(`User with ID ${id} not found!`);
    return user;
  }

  async findOne(email: string) {
    const requestedEmail = await this.userRepository.findOne({
      where: { email: email },
    });
    console.log('-- FindOne --', requestedEmail);
    return requestedEmail;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user)
      throw new NotFoundException(`User with id: ${id} not found hehe!`);

    if (updateUserDto.email) user.email = updateUserDto.email;

    if (updateUserDto.password)
      user.password = await argon2.hash(updateUserDto.password);

    await this.userRepository.save(user);

    return user;
  }

  async remove(id: number) {
    const userToDelete = await this.userRepository.findOne({
      where: { id },
    });
    if (!userToDelete)
      throw new BadRequestException(`User with id ${id} not found!`);

    await this.userRepository.delete(id);

    return { message: `The user with id:${id} deleted` };
  }
}

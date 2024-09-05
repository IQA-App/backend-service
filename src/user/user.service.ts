import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from "argon2";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
    ,) { }
  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      }
    })
    if (existUser) throw new BadRequestException('This email already exists !')
    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password)
    })

    return { user }
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException(`User with ID ${id} not found`);
    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) { //  will be updated in the future tickets
  //   return `This action updates a #${id} user`;
  // }

  async remove(id: number) {
    const userToDelete = await this.userRepository.findOne({ where: { id } })
    if (!userToDelete) throw new BadRequestException(`User with id ${id} not found!`)
    const deleteUser = await this.userRepository.delete(id)
    return deleteUser
  }
}

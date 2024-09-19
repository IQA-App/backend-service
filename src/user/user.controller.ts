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
  Request,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiTags('user')
  @ApiOperation({ summary: 'Create user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiTags('user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all users' })
  findAll() {
    return this.userService.findAll(); //  currently it possible with any logic untill we will have roels or scopes
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiTags('user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by id' })
  findOneById(@Param('id') id: string, @Request() req) {
    const numericId = Number(id);
    if (!id.trim() || isNaN(numericId) || numericId <= 0) {
      throw new BadRequestException(
        'Ah ah ! The id cannot be a whitespace! or the id must be a number! or the id must be a positive number!',
      );
    }

    const requestingUserId = req.user.id; //  get data from request object from JWT token
    if (requestingUserId !== +id) {
      // Users can only get their own accounts
      throw new UnauthorizedException('You are not allowed to get this user!');
    }
    return this.userService.findOneById(+id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiTags('user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    const numericId = Number(id);
    if (!id.trim() || isNaN(numericId) || numericId <= 0) {
      throw new BadRequestException(
        'Ah ah ! The id cannot be a whitespace! or the id must be a number! or the id must be a positive number!',
      );
    }

    const requestingUserId = req.user.id; //  get data from request object from JWT token
    if (requestingUserId !== +id) {
      // Users can only update their own accounts
      throw new UnauthorizedException(
        'You are not allowed to update this user!',
      );
    }
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiTags('user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user by ID' })
  async remove(@Param('id') id: string, @Request() req) {
    console.log('-- User from request: --', req.user);
    const numericId = Number(id);
    if (!id.trim() || isNaN(numericId) || numericId <= 0) {
      throw new BadRequestException(
        'Ah ah ! The id cannot be a whitespace! or the id must be a number! or the id must be a positive number!',
      );
    }

    const requestingUserId = req.user.id; //  get data from request object from JWT token
    if (requestingUserId !== +id) {
      // Users can only delete their own accounts
      throw new UnauthorizedException(
        'You are not allowed to delete this user!',
      );
    }
    return this.userService.remove(+id);
  }
}

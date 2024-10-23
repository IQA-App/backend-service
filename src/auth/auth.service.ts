import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/types/types';
import { identifier } from '@babel/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new BadRequestException(
        'User not found or email or password are incorrect!',
      );
    }

    const passwordIsMatch = await argon2.verify(user.password, password);
    if (passwordIsMatch) {
      return user;
    }
    throw new UnauthorizedException('Email or password are incorrect!');
  }

  async login(user: IUser) {
    const { id, email } = user;
    return {
      id,
      email,
      access_token: this.jwtService.sign({ id: user.id, email: user.email }),
    };
  }
}

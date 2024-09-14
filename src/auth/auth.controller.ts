import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiTags('auth')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'Password123#' },
      },
    },
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile') //  currently, it returns the user specified in the access token
  @UseGuards(JwtAuthGuard)
  @ApiTags('auth')
  @ApiOperation({ summary: 'Profile' })
  @ApiBearerAuth()
  getProfile(@Request() req) {
    return req.user;
  }
}

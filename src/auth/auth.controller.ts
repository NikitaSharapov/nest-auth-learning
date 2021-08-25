import {
  Controller,
  Post,
  UseGuards,
  Get,
  Body,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { ILoginData, IUser } from './types/auth.types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('create')
  async create(@Body() request: ILoginData) {
    return await this.authService.create(request);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() request: IUser) {
    return await this.authService.login(request);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Headers() headers) {
    return await this.authService.findUser(
      headers.authorization.replace('Bearer ', ''),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('refresh')
  async refresh(@Body() request: IUser) {
    return await this.authService.login(request);
  }
}

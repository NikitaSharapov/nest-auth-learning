import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../auth.repository';
import { ILoginData, IUser } from '../types/auth.types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async login(action: IUser): Promise<{ accessToken: string }> {
    const user = await this.authRepository.findOne(action);
    const payload = { id: user.id, login: user.login };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateAuth(action: ILoginData): Promise<IUser> {
    const user = await this.authRepository.findOne(action);
    if (user && (await bcrypt.compare(action.password, user.passwordHash))) {
      return user;
    }
  }

  async create(action: ILoginData): Promise<{ accessToken: string }> {
    const newUser = await this.authRepository.create(action);
    if (newUser) {
      return this.login(newUser);
    }
  }

  async findUser(action: string) {
    const token = this.jwtService.decode(action);
    return await this.authRepository.findById(token);
  }
}

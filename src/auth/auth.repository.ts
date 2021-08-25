import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { ILoginData, IUser } from './types/auth.types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(action: ILoginData): Promise<IUser> {
    return await this.userModel.findOne().where({ login: action.login }).exec();
  }

  async findById(action: any): Promise<IUser> {
    return await this.userModel.findById(action.id);
  }

  async create(action: ILoginData): Promise<IUser> {
    const user = new this.userModel({
      login: action.login,
      passwordHash: await bcrypt.hash(action.password, 10),
    });

    return user.save();
  }
}

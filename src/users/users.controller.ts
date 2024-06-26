import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { RegisterUserDto } from './register-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Post()
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    try {
      const user = new this.userModel({
        email: registerUserDto.email,
        password: registerUserDto.password,
        displayName: registerUserDto.displayName,
        role: registerUserDto.role,
      });

      user.generateToken();

      return await user.save();
    } catch (e) {
      if (e instanceof mongoose.Error.ValidationError) {
        throw new UnprocessableEntityException(e);
      }

      throw e;
    }
  }

  @UseGuards(AuthGuard('local'))
  @Post('sessions')
  async login(@Req() req: Request) {
    return { message: 'Logged in.', user: req.user };
  }

  @Delete('sessions')
  async deleteUser(@Req() req: Request) {
    const headerValue = req.get('Authorization');

    if (!headerValue) {
      return { message: 'Error! No header!' };
    }

    const [_, token] = headerValue.split(' ');

    if (!token) {
      return { message: 'Error! No token!' };
    }

    const user = await this.userModel.findOne({ token });

    if (!user) {
      return { message: 'Error! No user!' };
    }

    user.generateToken();
    await user.save();

    return { message: 'User logged out.' };
  }
}

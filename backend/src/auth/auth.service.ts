import { Injectable, Logger } from '@nestjs/common';
import { ILoginParams } from './auth.types';
import { LoginResultDto } from './dto/auth.index';

@Injectable()
export class AuthService {
  async login(user: ILoginParams): Promise<LoginResultDto> {
    Logger.log('This action logs a user in', user);
    return {
      token: 'token',
      role: 'user',
      username: user.username,
      lastname: 'lastname',
      firstname: 'firstname',
    };
  }
}

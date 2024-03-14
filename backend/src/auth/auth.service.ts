import { Injectable, Logger } from '@nestjs/common';

export interface ILoginParams {
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  login(user: ILoginParams) {
    Logger.log('This action logs a user in', user);
    return 'This action logs a user in';
  }
}

import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService, ILoginParams } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() body: ILoginParams) {
    return this.authService.login(body);
  }
}

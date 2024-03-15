import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginParamsDto, LoginResultDto } from './dto/auth.index';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login to app' })
  @ApiResponse({ status: 200, description: 'Ok', type: LoginResultDto })
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginParamsDto): Promise<LoginResultDto> {
    return await this.authService.login(body);
  }
}

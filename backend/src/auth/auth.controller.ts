import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
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
  async login(@Body() body: LoginParamsDto, @Res() response: Response) {
    const result = await this.authService.login(body);
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }
    response.cookie('session-token', result.token, {
      maxAge: 24 * 60 * 60 * 1000, // For example, 1 day
      sameSite: 'none',
      secure: true,
    });
    return response.send(result);
  }

  @ApiOperation({ summary: 'Login admin to app' })
  @ApiResponse({ status: 200, description: 'Ok', type: LoginResultDto })
  @Post('admin-login')
  @HttpCode(200)
  async loginAdmin(@Body() body: LoginParamsDto, @Res() response: Response) {
    const result = await this.authService.loginAdmin(body);
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }
    response.cookie('session-token', result.token, {
      maxAge: 24 * 60 * 60 * 1000, // For example, 1 day
      sameSite: 'none',
      secure: true,
    });
    // return new LoginResultDto(result);
    response.send(result);
  }

  @ApiOperation({ summary: 'Logout from app' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @Post('logout')
  @HttpCode(200)
  logout(@Res() response: Response) {
    response.cookie('session-token', '', {
      maxAge: 0, // Expire immediately
      sameSite: 'none',
      secure: true,
    });
    return response.json({ message: 'Logged out successfully' });
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginParamsDto, LoginResultDto } from './dto/auth.index';
import { UnauthorizedException } from '@nestjs/common';
import { Role } from './auth.types';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockCookie = jest.fn();
  const mockSend = jest.fn();
  const mockStatus = jest.fn();
  const mockResponse: any = {
    cookie: mockCookie,
    send: mockSend,
    status: mockStatus,
  };

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn(),
      loginAdmin: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(
      AuthService,
    ) as jest.Mocked<AuthService>;
  });

  it('user-login Happy flow', async () => {
    const loginParamsDto: LoginParamsDto = {
      username: 'user',
      password: 'pass',
    };

    const loginResultDto: LoginResultDto = {
      token: 'token',
      role: Role.USER,
      username: 'user',
      firstname: 'First',
      lastname: 'Last',
    };

    authService.login.mockResolvedValue(loginResultDto);

    await controller.login(loginParamsDto, mockResponse);

    expect(authService.login).toHaveBeenCalledWith(loginParamsDto);
    expect(mockCookie).toHaveBeenCalledWith(
      'session-token',
      loginResultDto.token,
      expect.objectContaining({
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'none',
        secure: true,
      }),
    );
  });

  // User Login Unauthorized
  it('login should throw UnauthorizedException when authService returns null for user', async () => {
    const loginParamsDto: LoginParamsDto = {
      username: 'user',
      password: 'wrong',
    };
    authService.login.mockResolvedValue(null);

    const mockResponse: any = { cookie: jest.fn() };

    await expect(
      controller.login(loginParamsDto, mockResponse),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('admin-login Happy flow', async () => {
    const loginParamsDto: LoginParamsDto = {
      username: 'admin',
      password: 'pass',
    };
    const loginResultDto: LoginResultDto = {
      token: 'admintoken',
      role: Role.ADMIN,
      username: 'admin',
      firstname: 'Admin',
      lastname: 'User',
    };

    authService.loginAdmin.mockResolvedValue(loginResultDto);

  

    await controller.loginAdmin(loginParamsDto, mockResponse);

    expect(authService.loginAdmin).toHaveBeenCalledWith(loginParamsDto);
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'session-token',
      loginResultDto.token,
      expect.objectContaining({
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'none',
        secure: true,
      }),
    );
  });

  it('admin-login should throw UnauthorizedException when authService returns null for admin', async () => {
    const loginParamsDto: LoginParamsDto = {
      username: 'admin',
      password: 'wrong',
    };
    authService.loginAdmin.mockResolvedValue(null);

    const mockResponse: any = { cookie: jest.fn() };

    await expect(
      controller.loginAdmin(loginParamsDto, mockResponse),
    ).rejects.toThrow(UnauthorizedException);
  });
});

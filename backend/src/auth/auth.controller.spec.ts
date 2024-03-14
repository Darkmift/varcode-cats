import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService, ILoginParams } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    // Mock AuthService
    const mockAuthService = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login should call authService.login with correct parameters', () => {
    const mockLoginParams: ILoginParams = {
      username: 'testUser',
      password: 'testPass',
    };
    controller.login(mockLoginParams);
    expect(authService.login).toHaveBeenCalledWith(mockLoginParams);
  });
});

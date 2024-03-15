import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginParamsDto, LoginResultDto } from './dto/auth.index';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    // Mock AuthService with a mocked method `login` that resolves to a value
    const mockAuthService = {
      login: jest.fn((dto: LoginParamsDto) =>
        Promise.resolve({
          token: 'mockToken',
          role: 'user',
          username: dto.username,
          lastname: 'Doe',
          firstname: 'John',
        } as LoginResultDto),
      ),
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login should call authService.login with correct parameters and return correctly', async () => {
    const mockLoginParams: LoginParamsDto = {
      username: 'testUser',
      password: 'testPass',
    };

    const expectedLoginResult: LoginResultDto = {
      token: 'mockToken',
      role: 'user',
      username: 'testUser',
      lastname: 'Doe',
      firstname: 'John',
    };

    // Call the controller's login method
    const result = await controller.login(mockLoginParams);

    // Verify that the authService's login method was called with the correct parameters
    expect(authService.login).toHaveBeenCalledWith(mockLoginParams);

    // Verify that the result of the controller's login method matches the expected value
    expect(result).toEqual(expectedLoginResult);
  });
});

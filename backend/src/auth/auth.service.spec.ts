import { Test, TestingModule } from '@nestjs/testing';
import { AuthService, ILoginParams } from './auth.service';
import { Logger } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let logSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Spy on the Logger.log method
    logSpy = jest.spyOn(Logger, 'log');
  });

  afterEach(() => {
    // Clean up the spy to avoid memory leaks and ensure a fresh spy for each test
    logSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('login should log the user in and return a success message', () => {
    const mockUser: ILoginParams = {
      username: 'testUser',
      password: 'testPass',
    };
    const loginResult = service.login(mockUser);

    expect(logSpy).toHaveBeenCalledWith('This action logs a user in', mockUser);
    expect(loginResult).toBe('This action logs a user in');
  });
});

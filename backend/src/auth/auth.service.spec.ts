import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Logger } from '@nestjs/common';
import { ILoginParams } from './auth.types';

describe('AuthService', () => {
  let service: AuthService;
  let logSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);

    logSpy = jest.spyOn(Logger, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('login should log the user in and return login result', async () => {
    const mockUser: ILoginParams = {
      username: 'testUser',
      password: 'testPass',
    };

    const loginResult = await service.login(mockUser);

    expect(logSpy).toHaveBeenCalledWith('This action logs a user in', mockUser);

    expect(loginResult).toEqual({
      token: expect.any(String),
      role: 'user',
      username: mockUser.username,
      lastname: 'lastname',
      firstname: 'firstname',
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { User, Admin } from './user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { RootConfig, validate } from '@/config/env.validation';
import { Cat, CatVote } from '@/cats/cats.entity';
import { IAdmin } from './auth.types';

jest.setTimeout(30000);

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          imports: [TypedConfigModule],
          useFactory: async (rootConfig: RootConfig) => ({
            secret: rootConfig.JWT_SECRET,
          }),
          inject: [RootConfig],
        }),
        TypedConfigModule.forRoot({
          isGlobal: true,
          schema: RootConfig,
          validate,
          load: dotenvLoader({
            envFilePath: '.env.test.local',
          }),
        }),
        TypeOrmModule.forRootAsync({
          imports: [TypedConfigModule],
          useFactory: async (rootConfig: RootConfig) => {
            const {
              NODE_ENV,
              POSTGRES_DB,
              POSTGRES_HOST,
              POSTGRES_PORT,
              POSTGRES_USER,
              POSTGRES_PASSWORD,
            } = rootConfig;

            const baseOptions = {
              type: 'postgres',
              entities: [Cat, CatVote, User, Admin],
              synchronize: true,
            };

            const options = {
              host: POSTGRES_HOST,
              port: POSTGRES_PORT,
              username: POSTGRES_USER,
              password: POSTGRES_PASSWORD,
              database: POSTGRES_DB,
            };
            return { ...options, ...baseOptions } as TypeOrmModuleOptions;
          },
          inject: [RootConfig],
        }),
        TypeOrmModule.forFeature([Cat, CatVote, User, Admin]),
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await service['userRepository'].query(
      'TRUNCATE TABLE admin, "user",cat, cat_vote CASCADE;',
    );
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const userParams = {
        username: 'testUser',
        password: 'password',
        first_name: 'Test',
        last_name: 'User',
      };

      const createdUser = await service.createUser(structuredClone(userParams));
      expect(createdUser).toBeDefined();
      expect(createdUser.username).toEqual(userParams.username);
      // Verify password is hashed
      expect(createdUser.password).not.toEqual(userParams.password);
    });
  });

  describe('getUserById', () => {
    let existingUserId: string;

    beforeAll(async () => {
      const newUser = await service.createUser({
        username: 'testUserForGetById',
        password: 'password',
        first_name: 'Test',
        last_name: 'UserGetById',
      });
      existingUserId = newUser.id;
    });

    it('should return a user by ID', async () => {
      const user = await service.getUserById(existingUserId);
      expect(user).toBeDefined();
      expect(user.id).toEqual(existingUserId);
    });

    it('should return null for a non-existing ID', async () => {
      const nonExistingId = 'b539dc9b-df17-441f-b863-eeeac0844a95';
      const user = await service.getUserById(nonExistingId);
      expect(user).toBeNull();
    });
  });

  describe('createAdmin', () => {
    it('should create and return an admin', async () => {
      const adminParams: IAdmin = {
        username: 'testAdmin',
        password: 'adminPassword',
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@test.com',
        accessLevel: 'admin',
      };

      const createdAdmin = await service.createAdmin(
        structuredClone(adminParams),
      );
      expect(createdAdmin).toBeDefined();
      expect(createdAdmin.username).toEqual(adminParams.username);
      // Verify password is hashed
      expect(createdAdmin.password).not.toEqual(adminParams.password);
    });
  });

  describe('login', () => {
    let testUserId: string;

    beforeAll(async () => {
      const user = await service.createUser({
        username: 'loginTestUser',
        password: 'testPass',
        first_name: 'Login',
        last_name: 'Test',
      });
      testUserId = user.id;
    });

    it('should allow a user to log in and return a valid token', async () => {
      const loginResult = await service.login({
        username: 'loginTestUser',
        password: 'testPass', // You need to adjust the logic to correctly validate the password
      });

      expect(loginResult).toBeDefined();
      expect(loginResult.token).toBeDefined();
      expect(loginResult.username).toBe('loginTestUser');
      expect(loginResult.role).toBe('user');
    });

    it('should return null for invalid login credentials', async () => {
      const loginResult = await service.login({
        username: 'nonexistentUser',
        password: 'wrongPass',
      });

      expect(loginResult).toBeNull();
    });
  });

  describe('loginAdmin', () => {
    let testAdminId: string;

    beforeAll(async () => {
      const admin = await service.createAdmin({
        username: 'loginTestAdmin',
        password: 'adminTestPass',
        first_name: 'Admin',
        last_name: 'LoginTest',
        email: 'admintest@test.com',
        accessLevel: 'admin',
      });
      testAdminId = admin.id;
    });

    it('should allow an admin to log in and return a valid token', async () => {
      const loginResult = await service.loginAdmin({
        username: 'loginTestAdmin',
        password: 'adminTestPass', // Adjust password validation logic accordingly
      });

      expect(loginResult).toBeDefined();
      expect(loginResult.token).toBeDefined();
      expect(loginResult.username).toBe('loginTestAdmin');
      expect(loginResult.role).toBe('admin');
    });

    it('should return null for invalid admin login credentials', async () => {
      const loginResult = await service.loginAdmin({
        username: 'nonexistentAdmin',
        password: 'wrongPass',
      });

      expect(loginResult).toBeNull();
    });
  });
});

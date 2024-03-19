import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { IAdmin, LevelEnum, Role } from './auth.types';
import SharedTestingModule from '@/../test/shared/sharedTestingModule';
import { DataSeederService } from '@/data-seeder/data-seeder.service';

jest.setTimeout(30000);

describe('AuthService', () => {
  let service: AuthService;
  let seedService: DataSeederService;
  let variantId:  string;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedTestingModule.register()],
    }).compile();

    service = module.get<AuthService>(AuthService);
    seedService = module.get<DataSeederService>(DataSeederService);
    const variantIds = await seedService.getCatVariantIds();
    variantId = variantIds[0];
  });

  afterAll(async () => {
    await seedService.deleteAllData();
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const userParams = {
        username: 'testUser',
        password: 'password',
        first_name: 'Test',
        last_name: 'User',
        cat_type: variantId as unknown as LevelEnum,
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
        cat_type: variantId as unknown as LevelEnum,
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
        accessLevel: Role.ADMIN,
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
        cat_type: variantId as unknown as LevelEnum,
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
    beforeAll(async () => {
      const admin = await service.createAdmin({
        username: 'loginTestAdmin',
        password: 'adminTestPass',
        first_name: 'Admin',
        last_name: 'LoginTest',
        email: 'admintest@test.com',
        accessLevel: Role.ADMIN,
      });
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

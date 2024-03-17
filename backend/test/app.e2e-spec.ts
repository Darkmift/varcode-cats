import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { DataSeederService } from '@/data-seeder/data-seeder.service';
import { AuthService } from '@/auth/auth.service';
import { createRandomUser } from '@/utils/fakerUtils';
import { hashString } from '@/utils/bcrypt';

jest.setTimeout(60000);
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dataSeederService: DataSeederService;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSeederService = moduleFixture.get<DataSeederService>(DataSeederService);
    authService = moduleFixture.get<AuthService>(AuthService);
    await dataSeederService.onModuleInit(); // Seed the database
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/auth/login (POST) should log user in and return token', async () => {
    const password = 'password1234';
    const username = 'userlogintest';
    const user = await createRandomUser();
    user.password = password;
    user.username = username;
    await authService.createUser(user); // Register the user in the database

    const loginDto = { username, password };
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);

    expect(response.body).toEqual({
      token: expect.any(String),
      role: expect.any(String),
      username: loginDto.username,
      lastname: expect.any(String),
      firstname: expect.any(String),
    });
    //expect a cookie called session-token
    expect(response.get('Set-Cookie')).toBeDefined();
    expect(response.get('Set-Cookie')[0]).toMatch(/session-token=.+/);
  });

  afterAll(async () => {
    await dataSeederService.deleteAllData(); // Clean up the database
    await app.close();
  });
});

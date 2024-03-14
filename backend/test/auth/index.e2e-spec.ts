import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '@/auth/auth.module';
import { ILoginParams } from '@/auth/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule], // Use your AuthModule here
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) should log user in', () => {
    const loginDto: ILoginParams = { username: 'test', password: 'test' };
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200) // Assuming your service responds with 200 OK on successful login
      .expect('This action logs a user in'); // Adjust based on your expected response
  });

  afterAll(async () => {
    await app.close();
  });
});

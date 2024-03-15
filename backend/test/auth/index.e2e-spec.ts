import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '@/auth/auth.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) should log user in and return token', async () => {
    const loginDto = { username: 'test', password: 'test' };
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
  });

  afterAll(async () => {
    await app.close();
  });
});

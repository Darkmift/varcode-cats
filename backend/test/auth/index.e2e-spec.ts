import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '@/auth/auth.module';
import { DataSeederService } from '@/data-seeder/data-seeder.service';
import { JwtModule } from '@nestjs/jwt';
import { DataSeederModule } from '@/data-seeder/data-seeder.module';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { RootConfig, validate } from '@/config/env.validation';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoggingModule } from '@/logging/logging.module';

describe.skip('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSeederService: DataSeederService;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        AuthModule,
        JwtModule.register({
          secret: 'testSecret',
          signOptions: { expiresIn: '60m' },
        }),
        DataSeederModule,
        TypedConfigModule.forRoot({
          isGlobal: true,
          schema: RootConfig,
          validate,
          load: dotenvLoader({
            envFilePath: '.env.test.local',
          }),
        }),
        TypeOrmModule.forRootAsync({
          imports: [TypedConfigModule, LoggingModule],
          useFactory: async (rootConfig: RootConfig) => {
            const {
              NODE_ENV,
              POSTGRES_DB,
              POSTGRES_HOST,
              POSTGRES_PORT,
              POSTGRES_USER,
              POSTGRES_PASSWORD,
            } = rootConfig;

            const path = __dirname + '/**/*.entity{.ts,.js}';
            const baseOptions = {
              type: 'postgres',
              entities: [path],
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
        AuthModule,
        DataSeederModule,
      ],
    }).compile();

    dataSeederService = moduleFixture.get<DataSeederService>(DataSeederService);
    await dataSeederService.onModuleInit();
  });

  beforeEach(async () => {
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) should log user in and return token', async () => {
    const loginDto = { username: 'testuser_1', password: 'password1234' };
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

  afterEach(async () => {
    await app?.close();
  });

  afterAll(async () => {
    await dataSeederService.deleteAllData();
  });
});

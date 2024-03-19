import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { RootConfig, validate } from '@/config/env.validation';
import { AuthService } from '@/auth/auth.service';
import { CatsService } from '@/cats/cats.service';
import { Cat, CatVote } from '@/cats/cats.entity';
import { User, Admin } from '@/auth/user.entity';
import { DataSeederService } from '@/data-seeder/data-seeder.service';
import { CatVariant } from '@/cats/cat-type.entity';

@Module({})
export default class SharedTestingModule {
  static register(): DynamicModule {
    return {
      module: SharedTestingModule,
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
              entities: [Cat, CatVote, User, Admin, CatVariant],
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
        // TypeOrmModule.forFeature([Cat, CatVote, User, Admin, CatType]),
      ],
      providers: [AuthService, CatsService, DataSeederService], // Add other services if needed
    };
  }
}

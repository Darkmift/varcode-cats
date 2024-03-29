import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RootConfig, validate } from './config/env.validation';
import { AuthModule } from './auth/auth.module';
import { CatsModule } from './cats/cats.module';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { LoggingModule } from './logging/logging.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSeederModule } from './data-seeder/data-seeder.module';

@Module({
  imports: [
    TypedConfigModule.forRoot({
      isGlobal: true,
      schema: RootConfig,
      validate,
      load: dotenvLoader({
        envFilePath: '.env',
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
        const baseOptions: TypeOrmModuleOptions = {
          type: 'postgres',
          entities: [path],
          synchronize: true,
          logging: true,
        };

        const options = {
          host: POSTGRES_HOST,
          port: POSTGRES_PORT,
          username: POSTGRES_USER,
          password: POSTGRES_PASSWORD,
          database: POSTGRES_DB,
        };
        Logger.log('initializing typeorm', { NODE_ENV });
        return { ...options, ...baseOptions } as TypeOrmModuleOptions;
      },
      inject: [RootConfig],
    }),
    AuthModule,
    CatsModule,
    LoggingModule,
    DataSeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

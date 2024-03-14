import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  RootConfig,
  validate,
} from './config/env.validation';
import { AuthModule } from './auth/auth.module';
import { CatsModule } from './cats/cats.module';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';

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
    AuthModule,
    CatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

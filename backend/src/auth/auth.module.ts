import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin, User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { TypedConfigModule } from 'nest-typed-config';
import { RootConfig } from '@/config/env.validation';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    TypeOrmModule.forFeature([User, Admin]),
    JwtModule.registerAsync({
      imports: [TypedConfigModule],
      useFactory: async (rootConfig: RootConfig) => ({
        secret: rootConfig.JWT_SECRET,
      }),
      inject: [RootConfig],
    }),
  ],
})
export class AuthModule {}

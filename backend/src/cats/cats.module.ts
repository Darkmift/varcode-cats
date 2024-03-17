import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { AuthModule } from '@/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat, CatVote } from './cats.entity';
import { User } from '@/auth/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { TypedConfigModule } from 'nest-typed-config';
import { RootConfig } from '@/config/env.validation';

@Module({
  providers: [CatsService],
  controllers: [CatsController],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Cat, CatVote, User]),
    JwtModule.registerAsync({
      imports: [TypedConfigModule],
      useFactory: async (rootConfig: RootConfig) => ({
        secret: rootConfig.JWT_SECRET,
      }),
      inject: [RootConfig],
    }),
  ],
})
export class CatsModule {}

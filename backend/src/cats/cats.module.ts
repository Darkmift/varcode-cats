import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { AuthModule } from '@/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat, CatVote } from './cats.entity';
import { User } from '@/auth/user.entity';

@Module({
  providers: [CatsService],
  controllers: [CatsController],
  imports: [AuthModule, TypeOrmModule.forFeature([Cat, CatVote, User])],
})
export class CatsModule {}

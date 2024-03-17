import { Module } from '@nestjs/common';
import { DataSeederService } from './data-seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat, CatVote } from '@/cats/cats.entity';
import { Admin, User } from '@/auth/user.entity';

@Module({
  providers: [DataSeederService],
  imports: [TypeOrmModule.forFeature([Cat, CatVote, User, Admin])],
})
export class DataSeederModule {}

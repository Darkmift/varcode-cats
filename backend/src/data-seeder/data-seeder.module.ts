import { Module } from '@nestjs/common';
import { DataSeederService } from './data-seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat, CatVote } from '@/cats/cats.entity';
import { Admin, User } from '@/auth/user.entity';
import { CatVariant } from '@/cats/cat-type.entity';

@Module({
  providers: [DataSeederService],
  imports: [TypeOrmModule.forFeature([Cat, CatVote, User, Admin, CatVariant])],
})
export class DataSeederModule {}

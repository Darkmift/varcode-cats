import { Module } from '@nestjs/common';
import { DataSeederService } from './data-seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat, CatVote } from '@/cats/cats.entity';
import { User } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v1';
import { Admin } from 'typeorm';

@Module({
  providers: [DataSeederService],
  imports: [TypeOrmModule.forFeature([Cat, CatVote, User, Admin])],
})
export class DataSeederModule {}

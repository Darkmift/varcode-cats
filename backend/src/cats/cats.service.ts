import { Injectable, Logger } from '@nestjs/common';
import {
  CatDTO,
  PaginationParamsDTO,
  PaginationResultDTO,
} from './dto/cats.index';
import { IVoteForCatParams } from './types/cats.type';
import { RootConfig } from '@/config/env.validation';
import { Repository } from 'typeorm';
import { Cat, CatVote } from './cats.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createRandomUser, createRandomCat } from '@/utils/fakerUtils';
import { AuthService } from '@/auth/auth.service';
import { IAdmin } from '@/auth/auth.types';
import { User } from '@/auth/user.entity';

@Injectable()
export class CatsService {
  constructor(
    private readonly rootConfig: RootConfig,
    @InjectRepository(Cat)
    private catRepository: Repository<Cat>,
    @InjectRepository(CatVote)
    private voteRepository: Repository<CatVote>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedData();
  }

  private async seedData(): Promise<void> {
    const start = performance.now();

    const { NODE_ENV } = this.rootConfig;

    const isProdEnv = NODE_ENV === 'production';
    const isStagingEnv = NODE_ENV === 'staging';

    if (isProdEnv || isStagingEnv) {
      Logger.log(
        'Seeding aborted production enviroment detected. ' + NODE_ENV,
        { time: performance.now() - start },
      );
      return;
    }

    Logger.log('Seeding data...', { NODE_ENV });

    try {
      const catsCount = await this.catRepository.count();
      if (catsCount > 0) {
        Logger.log('Seeding aborted, cats table is not empty');
        return;
      }

      const usersCount = await this.userRepository.count();
      if (usersCount > 0) {
        Logger.log('Seeding aborted, users table is not empty');
        return;
      }

      const votesCount = await this.voteRepository.count();
      if (votesCount > 0) {
        Logger.log('Seeding aborted, votes table is not empty');
        return;
      }

      Logger.log('Seeding kitties...');

      const CAT_AMOUNT = 1000;
      const randomCats = Array.from({ length: CAT_AMOUNT }, () =>
        createRandomCat(),
      );

      await this.batchInsert(this.catRepository, randomCats, CAT_AMOUNT);

      Logger.log('Seeding users...');

      const USER_AMOUNT = 100;
      const randomUsers = await Promise.all(
        Array.from({ length: USER_AMOUNT }, () => createRandomUser()),
      );
      await this.batchInsert(this.userRepository, randomUsers, USER_AMOUNT);

      Logger.log('Seeding votes...');

      const cats = await this.catRepository.find();
      const users = await this.userRepository.find();

      const uniqueVotes = new Set();
      const DIVIDER = 'vvvv';
      while (uniqueVotes.size < 5000) {
        uniqueVotes.add(
          `${users[Math.floor(Math.random() * users.length)].id}${DIVIDER}${
            cats[Math.floor(Math.random() * cats.length)].id
          }`,
        );
      }

      await Promise.all(
        Array.from(uniqueVotes).map((vote: string) => {
          const [userId, catId] = vote.split(DIVIDER);
          return this.addVoteForCat({ catId, userId });
        }),
      );

      Logger.log('Seeding admin...');

      const admin = await createRandomUser();
      admin.username = 'admin';
      admin.password = 'admin';

      admin['email'] = 'admin@admin.com';
      admin['accessLevel'] = 'admin';
      await this.authService.createAdmin(admin as IAdmin);
    } catch (error) {
      Logger.error('Seeding failed', error);
      throw error;
    }
    Logger.log('Seeding succesful...', { time: performance.now() - start });

    return;
  }

  private async batchInsert<T>(
    repository: Repository<T>,
    entities: T[],
    batchSize: number,
  ) {
    for (let i = 0; i < entities.length; i += batchSize) {
      const batch = entities.slice(i, i + batchSize);
      await repository.save(batch);
    }
  }

  async getTopFive(): Promise<CatDTO[]> {
    const topCats = await this.catRepository
      .createQueryBuilder('cat')
      .leftJoin('cat_vote', 'cv', 'cv.cat_id = cat.id')
      .select('cat')
      .addSelect('COUNT(cv.id)', 'likes')
      .groupBy('cat.id')
      .orderBy('likes', 'DESC')
      .limit(5)
      .getRawMany();

    return topCats.map((cat) => this.mapToDTO(cat));
  }

  async getPaginated({
    page,
    limit,
  }: PaginationParamsDTO): Promise<PaginationResultDTO<CatDTO>> {
    const [items, total] = await this.catRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    const catDTOs = items.map((cat) => this.mapToDTO(cat));

    const hasNext = total > page * limit;
    const hasPrev = page > 1;

    return {
      items: catDTOs,
      hasNext,
      total,
      hasPrev,
    };
  }

  private removePrefix(cat: Cat) {
    return Object.keys(cat).reduce((acc, key) => {
      const newKey = key.replace('cat_', '');
      acc[newKey] = cat[key];
      if (newKey === 'likes') {
        acc[newKey] = +cat[key];
      }
      return acc;
    }, {}) as Cat;
  }

  private mapToDTO(cat: Cat): CatDTO {
    const fixedCat = this.removePrefix(cat);
    return new CatDTO(fixedCat);
  }

  async getById(id: string): Promise<Cat> {
    const cat = await this.catRepository.findOne({ where: { id } });
    if (!cat) {
      Logger.warn('Cat not found', id);
    }
    return cat;
  }

  async addVoteForCat({ catId, userId }: IVoteForCatParams) {
    const voteExists = await this.voteRepository.findOneBy({
      cat: { id: catId },
      user: { id: userId },
    });
    if (voteExists) {
      Logger.warn('Vote already exists');
      return null;
    }

    const cat = await this.catRepository.findOneBy({ id: catId });
    if (!cat) {
      throw new Error('Cat not found');
    }

    const user = await this.authService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const vote = new CatVote();
    vote.cat = cat;
    vote.user = user;

    await this.voteRepository.save(vote);
    return vote;
  }

  async removeVoteForCat({ catId, userId }: IVoteForCatParams) {
    const voteExists = await this.voteRepository.findOneBy({
      cat: { id: catId },
      user: { id: userId },
    });
    if (!voteExists) {
      Logger.warn('Vote not found', {
        voteTodelete: voteExists,
        catId,
        userId,
      });
      return;
    }
    await this.voteRepository.remove(voteExists);
  }
}

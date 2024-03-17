import { Role } from '@/auth/auth.types';
import { Admin, User } from '@/auth/user.entity';
import { Cat, CatVote } from '@/cats/cats.entity';
import { RootConfig } from '@/config/env.validation';
import { hashString } from '@/utils/bcrypt';
import { createRandomCat, createRandomUser } from '@/utils/fakerUtils';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DataSeederService {
  constructor(
    private readonly rootConfig: RootConfig,
    @InjectRepository(Cat)
    private catRepository: Repository<Cat>,
    @InjectRepository(CatVote)
    private voteRepository: Repository<CatVote>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedData();
  }

  async seedData(): Promise<void> {
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

    const usersCount = await this.checkIfDataExists(this.userRepository);
    const catsCount = await this.checkIfDataExists(this.catRepository);
    const votesCount = await this.checkIfDataExists(this.voteRepository);

    if (usersCount || catsCount || votesCount) {
      Logger.log('Seeding aborted, data already exists', {
        time: performance.now() - start,
      });
      return;
    }

    await this.seedUsers(100);
    await this.seedCats(10000);
    await this.seedVotes(50000);

    Logger.log('Seeding data done', { time: `${performance.now() - start}ms` });
    return;
  }

  async seedUsers(amount: number): Promise<void> {
    const start = performance.now();
    Logger.log('Seeding users...', { amount });

    const randomUsers = (await Promise.all(
      Array.from({ length: amount }, () => createRandomUser()),
    )) as User[];

    await this.batchInsert(this.userRepository, randomUsers, 100);

    Logger.log('Seeding users done', {
      amount,
      time: `${performance.now() - start}ms`,
    });
  }

  async seedCats(amount: number): Promise<void> {
    const start = performance.now();
    Logger.log('Seeding cats...', { amount });

    const randomCats = (await Promise.all(
      Array.from({ length: amount }, () => createRandomCat()),
    )) as Cat[];

    await this.batchInsert(this.catRepository, randomCats, 200);

    Logger.log('Seeding cats done', {
      amount,
      time: `${performance.now() - start}ms`,
    });
  }

  async seedVotes(amount: number, injectedUsers?: User[]): Promise<void> {
    const start = performance.now();
    Logger.log('Seeding votes...', { amount });

    const cats = await this.catRepository.find();
    const users = injectedUsers || (await this.userRepository.find());

    const uniqueVotes = new Set();
    const DIVIDER = 'vvvv';
    while (uniqueVotes.size < 5000) {
      uniqueVotes.add(
        `${
          users[Math.floor(Math.random() * users.length)].id
        }${DIVIDER}${cats[Math.floor(Math.random() * cats.length)].id}`,
      );
    }

    const newVotes = Array.from(uniqueVotes).map((vote: string) => {
      const [userId, catId] = vote.split(DIVIDER);
      const cat = cats.find((cat) => cat.id === catId);
      const user = users.find((user) => user.id === userId);
      const newVote = new CatVote();
      newVote.cat = cat;
      newVote.user = user;
      return newVote;
    });

    await this.batchInsert(this.voteRepository, newVotes, 400);

    Logger.log('Seeding votes done', {
      amount,
      time: `${performance.now() - start}ms`,
    });
    return;
  }

  async seedAdmin(): Promise<void> {
    const start = performance.now();
    Logger.log('Seeding admin...');

    const admin = new Admin();
    admin.email = 'admin@admin.com';
    admin.password = await hashString('superAdmin1');
    admin.first_name = 'Super';
    admin.last_name = 'Admin';
    admin.accessLevel = Role.SUPER_ADMIN;

    await this.adminRepository.save(admin);

    Logger.log('Seeding admin done', {
      time: `${performance.now() - start}ms`,
    });
  }

  async seedTestUsers(amount: number): Promise<void> {
    const start = performance.now();
    Logger.log('Seeding test users...');
    const hashedpassword = await hashString('password1234');
    const newUsers = Array.from({ length: amount }, (v, i) => {
      const user = new User();
      user.first_name = 'Test' + i;
      user.last_name = 'User' + i;
      user.password = hashedpassword;
      return user;
    });

    await this.batchInsert(this.userRepository, newUsers, 10);

    await this.seedVotes(500, newUsers);

    Logger.log('Seeding test users done', {
      time: `${performance.now() - start}ms`,
    });
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

  private async checkIfDataExists<T>(
    repository: Repository<T>,
  ): Promise<boolean> {
    const count = await repository.count();
    return count > 0;
  }

  async deleteAllData(): Promise<void> {
    Logger.log('Wiping database...');
    if (this.rootConfig.NODE_ENV === 'production') {
      Logger.warn(
        'WIPING DATABASE ABORTED, PRODUCTION ENVIROMENT DETECTED.' +
          this.rootConfig.NODE_ENV,
      );

      return;
    }

    await this.catRepository.query(
      'TRUNCATE TABLE admin, "user",cat, cat_vote CASCADE;',
    );
  }

  async getRandomItems<T>(
    repository: Repository<T>,
    name: string,
    amount: number,
  ): Promise<T[]> {
    return await repository
      .createQueryBuilder(name)
      .select()
      .orderBy('RANDOM()')
      .limit(amount)
      .getMany();
  }
}

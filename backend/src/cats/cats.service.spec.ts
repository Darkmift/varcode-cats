import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CatsService } from './cats.service';
import { Cat, CatVote } from './cats.entity';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { RootConfig, validate } from '@/config/env.validation';
import { Admin, User } from '@/auth/user.entity';
import { AuthModule } from '@/auth/auth.module';

jest.setTimeout(30000);

jest.mock('@/utils/datadog/datadog', () => {
  return {
    DatadogLogger: jest.fn().mockImplementation(() => ({
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    })),
  };
});

describe('CatsService', () => {
  let service: CatsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        TypedConfigModule.forRoot({
          isGlobal: true,
          schema: RootConfig,
          validate,
          load: dotenvLoader({
            envFilePath: '.env.test.local',
          }),
        }),
        TypeOrmModule.forRootAsync({
          imports: [TypedConfigModule],
          useFactory: async (rootConfig: RootConfig) => {
            const {
              NODE_ENV,
              POSTGRES_DB,
              POSTGRES_HOST,
              POSTGRES_PORT,
              POSTGRES_USER,
              POSTGRES_PASSWORD,
            } = rootConfig;

            const baseOptions = {
              type: 'postgres',
              entities: [Cat, CatVote, User, Admin],
              synchronize: true,
            };

            const options = {
              host: POSTGRES_HOST,
              port: POSTGRES_PORT,
              username: POSTGRES_USER,
              password: POSTGRES_PASSWORD,
              database: POSTGRES_DB,
            };
            return { ...options, ...baseOptions } as TypeOrmModuleOptions;
          },
          inject: [RootConfig],
        }),
        TypeOrmModule.forFeature([Cat, CatVote, User, Admin]),
      ],
      providers: [CatsService],
    }).compile();

    service = module.get<CatsService>(CatsService);
    await service.onModuleInit();
  });

  afterAll(async () => {
    await service['catRepository'].query(
      'TRUNCATE TABLE admin, "user",cat, cat_vote CASCADE;',
    );
  });

  describe('getTopFive', () => {
    it('should return top 5 cats based on votes', async () => {
      const topCats = await service.getTopFive();

      expect(topCats).toBeDefined();
      expect(Array.isArray(topCats)).toBeTruthy();
      expect(topCats.length).toBeLessThanOrEqual(5);
      // Add more detailed assertions as needed
    });
  });

  describe('getPaginated', () => {
    it('should return paginated cats', async () => {
      // Assuming your seeding process includes creating some cats,
      // adjust `expectedTotal` and `expectedPageCount` based on your seed data.
      const expectedTotal = 1000; // Example total seeded cats
      const page = 1;
      const limit = 10;
      const paginationParams = { page, limit };

      const result = await service.getPaginated(paginationParams);

      expect(result).toBeDefined();
      expect(result.items.length).toBeLessThanOrEqual(limit);
      expect(result.total).toBe(expectedTotal);
      expect(result.hasNext).toBe(true);
      expect(result.hasPrev).toBe(false);
    });
  });

  describe('Voting', () => {
    // Assuming there's at least one cat and one user seeded by your `seedData` method.
    it('should allow a user to vote for a cat and then remove the vote', async () => {
      const cat = await service['catRepository']
        .createQueryBuilder('cat')
        .select()
        .orderBy('RANDOM()')
        .getOne();
      const user = await service['userRepository']
        .createQueryBuilder('user')
        .select()
        .orderBy('RANDOM()')
        .getOne();
      const voteParams = { catId: cat.id, userId: user.id };

      // Add a vote
      const vote = await service.addVoteForCat(voteParams);
      expect(vote).toBeDefined();
      expect(vote.cat.id).toEqual(cat.id);
      expect(vote.user.id).toEqual(user.id);

      // Remove the vote
      await service.removeVoteForCat(voteParams);
      const removedVote = await service['voteRepository'].findOne({
        where: { cat: { id: cat.id }, user: { id: user.id } },
      });
      expect(removedVote).toBeNull();
    });
  });

  describe('getById', () => {
    it('should return a cat when given a valid ID', async () => {
      const existingCat = await service['catRepository'].findOneBy({});
      if (!existingCat) {
        throw new Error('No cats found in the database');
      }
      // Use the existingCatId fetched in the beforeAll hook
      const cat = await service.getById(existingCat.id);

      expect(cat).toBeDefined();
      expect(cat.id).toBe(existingCat.id);
    });

    it('should return null or handle appropriately when given a non-existing ID', async () => {
      const randomId = '123e4567-e89b-12d3-a456-426614174000';
      const cat = await service.getById(randomId);

      expect(cat).toBeNull();
    });
  });
});

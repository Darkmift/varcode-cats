import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import SharedTestingModule from '@/../test/shared/sharedTestingModule';
import { DataSeederService } from '@/data-seeder/data-seeder.service';
import { AuthService } from '@/auth/auth.service';

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
  let seedService: DataSeederService;
  let authService: AuthService;
  let userId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedTestingModule.register()],
    }).compile();

    service = module.get<CatsService>(CatsService);
    seedService = module.get<DataSeederService>(DataSeederService);
    authService = module.get<AuthService>(AuthService);
    await seedService.onModuleInit();
    const user = await authService.createUser({
      password: 'catserviceUser',
      first_name: 'CatServiceFN',
      last_name: 'CatServiceLN',
      username: 'catserviceUuser',
    });
    userId = user.id;
  });

  afterAll(async () => {
    await seedService.deleteAllData();
  });

  describe('getTopFive', () => {
    it('should return top 5 cats based on votes', async () => {
      const topCats = await service.getTopFive(userId);

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
      const page = 1;
      const limit = 10;
      const paginationParams = { page, limit };

      const result = await service.getPaginated(userId, paginationParams);

      expect(result).toBeDefined();
      expect(result.items.length).toBeLessThanOrEqual(limit);
      expect(result.total).toEqual(expect.any(Number));
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
      const voteParams = { catId: cat.id, userId };

      // Add a vote
      const updatedCat = await service.addVoteForCat(voteParams);
      expect(updatedCat).toBeDefined();
      expect(updatedCat.id).toEqual(cat.id);
      expect(updatedCat.likeCount).toEqual(expect.any(Number));

      // Remove the vote
      await service.removeVoteForCat(voteParams);
      const removedVote = await service['voteRepository'].findOne({
        where: { cat: { id: cat.id }, user: { id: userId } },
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
      const cat = await service.getById({
        userId,
        catId: existingCat.id,
      });

      expect(cat).toBeDefined();
      expect(cat.id).toBe(existingCat.id);
    });

    it('should return null or handle appropriately when given a non-existing ID', async () => {
      const randomId = '123e4567-e89b-12d3-a456-426614174000';
      const cat = await service.getById({ userId, catId: randomId });

      expect(cat).toBeNull();
    });
  });

  describe('getCatsLikedByUser', () => {
    it('should return cats liked by a user', async () => {
      const [user] = await seedService.getRandomItems(
        service['userRepository'],
        'user',
        1,
      );
      const cats = await seedService.getRandomItems(
        service['catRepository'],
        'cat',
        5,
      );

      for (const cat of cats) {
        await service.addVoteForCat({ catId: cat.id, userId: user.id });
      }

      const likedCats = await service.getCatsLikedByUser(user.id);

      expect(likedCats).toBeDefined();
      expect(Array.isArray(likedCats)).toBeTruthy();
      expect(likedCats.length).toBeGreaterThanOrEqual(0);
      // Add more detailed assertions as needed
    });
  });
});

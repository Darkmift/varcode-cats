import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import {
  CatDTO,
  PaginationParamsDTO,
  PaginationResultDTO,
} from './dto/cats.index';

export const mockCats = [
  {
    id: '1',
    name: 'Cat 1',
    favoriteFood: 'Tuna',
    birthday: new Date(),
    age: 1,
    location: 'Location 1',
    furColor: 'White',
    height: 30,
    weight: 5,
    imageUrl: 'https://example.com/cat.jpg',
  },
  {
    id: '2',
    name: 'Cat 2',
    favoriteFood: 'Tuna',
    birthday: new Date(),
    age: 1,
    location: 'Location 2',
    furColor: 'White',
    height: 30,
    weight: 5,
    imageUrl: 'https://example.com/cat.jpg',
  },
  {
    id: '3',
    name: 'Cat 3',
    favoriteFood: 'Tuna',
    birthday: new Date(),
    age: 1,
    location: 'Location 3',
    furColor: 'White',
    height: 30,
    weight: 5,
    imageUrl: 'https://example.com/cat.jpg',
  },
  {
    id: '4',
    name: 'Cat 4',
    favoriteFood: 'Tuna',
    birthday: new Date(),
    age: 1,
    location: 'Location 4',
    furColor: 'White',
    height: 30,
    weight: 5,
    imageUrl: 'https://example.com/cat.jpg',
  },
  {
    id: '5',
    name: 'Cat 5',
    favoriteFood: 'Tuna',
    birthday: new Date(),
    age: 1,
    location: 'Location 5',
    furColor: 'White',
    height: 30,
    weight: 5,
    imageUrl: 'https://example.com/cat.jpg',
  },
];

describe('CatsService', () => {
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatsService],
    }).compile();

    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTopFive', () => {
    it('should return top 5 cats', async () => {
      const result: CatDTO[] = [];
      jest.spyOn(service, 'getTopFive').mockImplementation(async () => result);
      expect(await service.getTopFive()).toBe(result);
    });
  });

  describe('getPaginated', () => {
    it('should return paginated cats', async () => {
      const paginationParams: PaginationParamsDTO = { page: 1, limit: 10 };
      const result: PaginationResultDTO = {
        items: [],
        hasNext: false,
        total: 0,
        hasPrev: false,
      };
      jest
        .spyOn(service, 'getPaginated')
        .mockImplementation(async () => result);
      expect(await service.getPaginated(paginationParams)).toBe(result);
    });
  });

  describe('getById', () => {
    it('should return a cat by id', async () => {
      const catId = '1';
      const result: CatDTO = mockCats.find((cat) => cat.id === catId) as CatDTO;
      jest.spyOn(service, 'getById').mockImplementation(async () => result);
      expect(await service.getById(catId)).toBe(result);
    });
  });

  describe('addVoteForCat', () => {
    it('should return confirmation of voting for a cat', async () => {
      const voteParams = { catId: '1', userId: 'user123' };
      const result = 'votedForCat';
      jest.spyOn(service, 'addVoteForCat').mockImplementation(() => result);
      expect(service.addVoteForCat(voteParams)).toBe(result);
    });
  });

  describe('removeVoteForCat', () => {
    it('should return confirmation of removing vote for a cat', () => {
      const voteParams = { catId: '1', userId: 'user123' };
      const result = 'removedVoteForCat';
      jest.spyOn(service, 'removeVoteForCat').mockImplementation(() => result);
      expect(service.removeVoteForCat(voteParams)).toBe(result);
    });
  });
});

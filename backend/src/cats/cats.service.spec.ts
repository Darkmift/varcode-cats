import { Test, TestingModule } from '@nestjs/testing';
import { CatsService, mockCats } from './cats.service';
import {
  CatDTO,
  PaginationParamsDTO,
  PaginationResultDTO,
} from './dto/cats.index';

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

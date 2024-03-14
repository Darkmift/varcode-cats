import { Test, TestingModule } from '@nestjs/testing';
import {
  CatsService,
  PaginationParams,
  VoteForCatParams,
} from './cats.service';

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

  it('getTopFive should return top cats', () => {
    expect(service.getTopFive()).toBe('topCats');
  });

  it('getPaginated should return paginated cats', () => {
    const paginationParams: PaginationParams = { page: 1, limit: 10 };
    expect(service.getPaginated(paginationParams)).toBe('paginatedCats');
  });

  it('getById should return a cat by id', () => {
    const catId = 'cat123';
    expect(service.getById(catId)).toBe('catById');
  });

  it('addVoteForCat should return confirmation of voting for a cat', () => {
    const voteParams: VoteForCatParams = { catId: 'cat123', userId: 'user123' };
    expect(service.addVoteForCat(voteParams)).toBe('votedForCat');
  });

  it('removeVoteForCat should return confirmation of removing vote for a cat', () => {
    const voteParams: VoteForCatParams = { catId: 'cat123', userId: 'user123' };
    expect(service.removeVoteForCat(voteParams)).toBe('votedForCat');
  });
});

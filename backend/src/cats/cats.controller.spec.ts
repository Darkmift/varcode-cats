import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

describe('CatsController', () => {
  let controller: CatsController;
  let catsService: CatsService;

  beforeEach(async () => {
    // Mock CatsService
    const mockCatsService = {
      getTopFive: jest.fn(),
      getPaginated: jest.fn(),
      getById: jest.fn(),
      addVoteForCat: jest.fn(),
      removeVoteForCat: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [{ provide: CatsService, useValue: mockCatsService }],
    }).compile();

    controller = module.get<CatsController>(CatsController);
    catsService = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get top five cats', () => {
    controller.getTopFive();
    expect(catsService.getTopFive).toHaveBeenCalled();
  });

  it('should get paginated cats', () => {
    const query = { page: 1, limit: 5 };
    controller.getPaginated(query);
    expect(catsService.getPaginated).toHaveBeenCalledWith(query);
  });

  it('should get a cat by id', () => {
    const catId = '1';
    controller.getById(catId);
    expect(catsService.getById).toHaveBeenCalledWith(catId);
  });

  it('should vote for a cat', () => {
    const catId = '1';
    controller.voteForCat(catId);
    expect(catsService.addVoteForCat).toHaveBeenCalledWith({
      catId,
      userId: '1',
    });
  });

  it('should remove vote for a cat', () => {
    const catId = '1';
    controller.removeVoteForCat(catId);
    expect(catsService.removeVoteForCat).toHaveBeenCalledWith({
      catId,
      userId: '1',
    });
  });
});

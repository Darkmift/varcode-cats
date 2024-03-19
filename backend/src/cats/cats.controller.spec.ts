import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { PaginationParamsDTO } from './dto/cats.index';
import { Request } from 'express';
import { JwtAuthGuard } from '@/auth/guards/auth.jwt';
import { MockJwtAuthGuard } from '@/../test/shared/mocks/MockJwtAuthGuard';
import { JwtService } from '@nestjs/jwt';

describe('CatsController', () => {
  let controller: CatsController;
  let service: CatsService;

  beforeEach(async () => {
    const mockCatsService = {
      getTopFive: jest.fn(() => Promise.resolve([])),
      getPaginated: jest.fn((query: PaginationParamsDTO) =>
        Promise.resolve({ items: [], total: 0 }),
      ),
      getById: jest.fn((id: string) => Promise.resolve({ id })),
      addVoteForCat: jest.fn(({ catId, userId }) =>
        Promise.resolve(`Vote added for cat ${catId} by user ${userId}`),
      ),
      removeVoteForCat: jest.fn(({ catId, userId }) =>
        Promise.resolve(`Vote removed for cat ${catId} by user ${userId}`),
      ),
    };

    const mockJwtService = {
      verify: jest.fn().mockImplementation(() => ({ userId: 'mockUserId' })),
      // Add any other methods from JwtService that you use
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        { provide: CatsService, useValue: mockCatsService },
        { provide: JwtService, useValue: mockJwtService }, // Mock JwtService
        { provide: JwtAuthGuard, useClass: MockJwtAuthGuard }, // Use the mock guard
      ],
    }).compile();

    controller = module.get<CatsController>(CatsController);
    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTopFive', () => {
    it('should return an array of top five cats, each with an id and name', async () => {
      // Resolve and check the response directly
      const response = await controller.getTopFive({
        user: { id: 'userId' },
      } as Request);
      expect(response).toEqual([]);
      expect(service.getTopFive).toHaveBeenCalled();

      // Check each cat for 'id' and 'name' properties
      response.forEach((cat) => {
        expect(cat).toHaveProperty('id');
        expect(cat).toHaveProperty('name');
      });
    });
  });

  describe('getPaginated', () => {
    it('should return a pagination result', async () => {
      const query: PaginationParamsDTO = { page: 1, limit: 10 };
      await expect(
        controller.getPaginated(query, { user: { id: 'userId' } } as Request),
      ).resolves.toEqual({
        items: [],
        total: 0,
      });
      expect(service.getPaginated).toHaveBeenCalledWith(query);
    });
  });

  describe('getById', () => {
    it('should return a cat by ID', async () => {
      const id = 'some-id';
      await expect(
        controller.getById(id, { user: { id: 'userId' } } as Request),
      ).resolves.toEqual({ id });
      expect(service.getById).toHaveBeenCalledWith(id);
    });
  });

  describe('voteForCat', () => {
    it('should simulate voting for a cat', async () => {
      const catId = 'cat-id';
      const userId = 'Extracted-From-JWT'; // This is simulated for the test case
      await expect(
        controller.voteForCat(catId, { user: { id: userId } } as Request),
      ).resolves.toEqual(`Vote added for cat ${catId} by user ${userId}`);
      expect(service.addVoteForCat).toHaveBeenCalledWith({ catId, userId });
    });
  });

  describe('removeVoteForCat', () => {
    it('should simulate removing a vote for a cat', async () => {
      const catId = 'cat-id';
      const userId = 'Extracted-From-JWT'; // This is simulated for the test case
      await expect(
        controller.removeVoteForCat(catId, { user: { id: userId } } as Request),
      ).resolves.toEqual(`Vote removed for cat ${catId} by user ${userId}`);
      expect(service.removeVoteForCat).toHaveBeenCalledWith({ catId, userId });
    });
  });
});

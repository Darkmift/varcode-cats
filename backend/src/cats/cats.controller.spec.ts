import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CatDTO, PaginationParamsDTO } from './dto/cats.index';
import { Request } from 'express';
import { JwtAuthGuard } from '@/auth/guards/auth.jwt';
import { MockJwtAuthGuard } from '@/../test/shared/mocks/MockJwtAuthGuard';
import { JwtService } from '@nestjs/jwt';
import { IPaginationResult, IQueryCatsParams } from './types/cats.type';
import { CatVariant } from './cat-type.entity';
import { IUserParams, Role } from '@/auth/auth.types';

describe('CatsController', () => {
  let controller: CatsController;
  let service: CatsService;

  const mockParamsOrReult = {
    catId: '0002d31d-f9be-4056-86ca-4c22fb780622',
    userId: '881314b4-5a9f-47ae-b175-39e7d06d15b0',
  };
  let mockCat: CatDTO;
  let mockPAginatedResult: IPaginationResult<CatDTO>;
  let mockUserParams: IUserParams;

  beforeEach(async () => {
    const level = new CatVariant();
    level.level = 1;
    mockCat = new CatDTO({
      id: mockParamsOrReult.catId,
      name: 'Cat Name',
      birthday: new Date(),
      favorite_food: 'Cat Food',
      location: 'Cat Location',
      fur_color: 'Cat Fur Color',
      image_url: 'Cat Image URL',
      height: 10,
      weight: 10,
      likeCount: 10,
      likedByUser: false,
      cat_type_id: level,
    });

    mockPAginatedResult = {
      items: [mockCat],
      hasNext: false,
      hasPrev: false,
      total: 1,
    };
    mockUserParams = {
      userId: '000fa245-fc23-4f7b-9454-01877874fbf0',
      role: Role.USER,
      cat_type_id: '0002d31d-f9be-4056-86ca-4c22fb780622',
    };
    const mockCatsService = {
      getTopFive: jest.fn(
        (userParams: IUserParams): Promise<CatDTO[]> =>
          Promise.resolve([mockCat]),
      ),
      getPaginated: jest.fn(
        (
          userParams: IUserParams,
          query: PaginationParamsDTO,
        ): Promise<IPaginationResult<CatDTO>> =>
          Promise.resolve(mockPAginatedResult),
      ),
      getById: jest.fn(
        (params: IUserParams & IQueryCatsParams): Promise<CatDTO> => {
          mockCat.id;
          return Promise.resolve(mockCat);
        },
      ),
      addVoteForCat: jest.fn(
        (params: IUserParams & IQueryCatsParams): Promise<CatDTO> => {
          mockCat.id = params.catId;
          mockCat.likedByUser = true;
          mockCat.likeCount++;
          return Promise.resolve(structuredClone(mockCat));
        },
      ),
      removeVoteForCat: jest.fn(
        (params: IUserParams & IQueryCatsParams): Promise<CatDTO> => {
          mockCat.id = params.catId;
          mockCat.likedByUser = false;
          mockCat.likeCount--;
          return Promise.resolve(structuredClone(mockCat));
        },
      ),
    };

    const mockJwtService = {
      verify: jest.fn().mockImplementation(() => mockUserParams),
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
      expect(response[0].id).toBe(mockCat.id);
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
        controller.getPaginated(query, {
          user: {
            id: mockUserParams.userId,
            cat_type_id: mockUserParams.cat_type_id,
            role: mockUserParams.role,
          },
        } as Request),
      ).resolves.toEqual(mockPAginatedResult);
      expect(service.getPaginated).toHaveBeenCalledWith(mockUserParams, query);
    });
  });

  describe('getById', () => {
    it('should return a cat by ID', async () => {
      await expect(
        controller.getById(mockParamsOrReult.catId, {
          user: { id: mockParamsOrReult.userId },
        } as Request),
      ).resolves.toEqual(mockCat);
      expect(service.getById).toHaveBeenCalledWith(mockParamsOrReult);
    });
  });

  describe('voteForCat', () => {
    it('should simulate voting for a cat', async () => {
      const catId = 'cat-id';
      const userId = 'Extracted-From-JWT'; // This is simulated for the test case
      const result = await controller.voteForCat(catId, {
        user: { id: userId },
      } as Request);
      expect(service.addVoteForCat).toHaveBeenCalledWith({ catId, userId });
      expect(result.likeCount).toEqual(mockCat.likeCount + 1);
    });
  });

  describe('removeVoteForCat', () => {
    it('should simulate removing a vote for a cat', async () => {
      const result = await controller.voteForCat(mockParamsOrReult.catId, {
        user: { id: mockParamsOrReult.userId },
      } as Request);
      expect(service.addVoteForCat).toHaveBeenCalledWith(mockParamsOrReult);
      expect(result.likeCount).toEqual(mockCat.likeCount - 1);
    });
  });
});

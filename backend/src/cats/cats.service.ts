import { Injectable } from '@nestjs/common';
import {
  CatDTO,
  PaginationParamsDTO,
  PaginationResultDTO,
} from './dto/cats.index';
import { IVoteForCatParams } from './types/cats.type';

// temp will be replaced with DB logic
import { mockCats } from './cats.service.spec';

@Injectable()
export class CatsService {
  async getTopFive(): Promise<CatDTO[]> {
    return mockCats;
  }

  async getPaginated({
    page,
    limit,
  }: PaginationParamsDTO): Promise<PaginationResultDTO> {
    return {
      items: [],
      hasNext: false,
      total: 0,
      hasPrev: false,
    };
  }

  async getById(id: string): Promise<CatDTO> {
    return mockCats[0];
  }

  addVoteForCat({ catId, userId }: IVoteForCatParams) {
    return 'votedForCat';
  }

  removeVoteForCat({ catId, userId }: IVoteForCatParams) {
    return 'votedForCat';
  }
}

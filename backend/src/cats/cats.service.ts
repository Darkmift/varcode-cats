import { Injectable } from '@nestjs/common';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface VoteForCatParams {
  catId: string;
  userId: string;
}

@Injectable()
export class CatsService {
  getTopFive() {
    return 'topCats';
  }

  getPaginated({ page, limit }: PaginationParams) {
    return 'paginatedCats';
  }

  getById(id: string) {
    return 'catById';
  }

  addVoteForCat({ catId, userId }: VoteForCatParams) {
    return 'votedForCat';
  }

  removeVoteForCat({ catId, userId }: VoteForCatParams) {
    return 'votedForCat';
  }
}

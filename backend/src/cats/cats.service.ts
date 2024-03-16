import { Injectable } from '@nestjs/common';
import {
  CatDTO,
  PaginationParamsDTO,
  PaginationResultDTO,
} from './dto/cats.index';
import { IVoteForCatParams } from './types/cats.type';

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

// a CatDTO with name,birthday,age,location,favoriteFood,fur color,height,weight,imageUrl

import { ApiProperty } from '@nestjs/swagger';
import { ICat, IPaginationParams, IPaginationResult } from '../types/cats.type';

export class CatDTO implements ICat {
  @ApiProperty({
    description: 'The ID of the cat',
    example: 'some uuid string',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the cat',
    example: 'Fluffy',
  })
  name: string;

  @ApiProperty({
    description: 'The birthday of the cat',
    example: '2021-01-01',
  })
  birthday: Date;

  @ApiProperty({
    description: 'The age of the cat',
    example: 1,
  })
  age: number;

  @ApiProperty({
    description: 'The location of the cat',
    example: 'New York',
  })
  location: string;

  @ApiProperty({
    description: 'The favorite food of the cat',
    example: 'Tuna',
  })
  favoriteFood: string;

  @ApiProperty({
    description: 'The fur color of the cat',
    example: 'White',
  })
  furColor: string;

  @ApiProperty({
    description: 'The height of the cat',
    example: 30,
  })
  height: number;

  @ApiProperty({
    description: 'The weight of the cat',
    example: 5,
  })
  weight: number;

  @ApiProperty({
    description: 'The image URL of the cat',
    example: 'https://example.com/cat.jpg',
  })
  imageUrl: string;
}

export class PaginationParamsDTO implements IPaginationParams {
  @ApiProperty({
    description: 'The page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'The number of items per page',
    example: 10,
  })
  limit: number;
}

export class PaginationResultDTO implements IPaginationResult<CatDTO> {
  @ApiProperty({
    description: 'The total number of items',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'The list of items',
    type: [CatDTO],
  })
  items: CatDTO[];

  //has next ,has prev
  @ApiProperty({
    description: 'Whether there are more items',
    example: true,
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Whether there are previous items',
    example: false,
  })
  hasPrev: boolean;
}

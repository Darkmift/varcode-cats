// a CatDTO with name,birthday,age,location,favoriteFood,fur color,height,weight,imageUrl

import { ApiProperty } from '@nestjs/swagger';
import { ICat, IPaginationParams, IPaginationResult } from '../types/cats.type';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { CatVariant } from '../cat-type.entity';

export class CatDTO implements ICat {
  constructor(cat: ICat) {
    this.id = cat.id;
    this.name = cat.name;
    this.birthday = cat.birthday;
    this.location = cat.location;
    this.favorite_food = cat.favorite_food;
    this.fur_color = cat.fur_color;
    this.height = cat.height;
    this.weight = cat.weight;
    this.image_url = cat.image_url;
    this.likeCount = cat.likes as unknown as number;
    this.likedByUser = !!cat.likedByUser;
    this.cat_type = cat.cat_type;
  }

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
  get age(): number {
    return differenceInYears(new Date(), this.birthday);
  }

  @ApiProperty({
    description: 'The location of the cat',
    example: 'New York',
  })
  location: string;

  @ApiProperty({
    description: 'The favorite food of the cat',
    example: 'Tuna',
  })
  favorite_food: string;

  @ApiProperty({
    description: 'The fur color of the cat',
    example: 'White',
  })
  fur_color: string;

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
  image_url: string;

  //add a likeCount
  @ApiProperty({
    description: 'The number of likes of the cat',
    example: 100,
  })
  likeCount: number;

  // add likedByUser
  @ApiProperty({
    description: 'Whether the cat is liked by the user',
    example: true,
  })
  likedByUser: boolean;

  // add cat_type
  @ApiProperty({
    description: 'The type of the cat',
    example: '1',
  })
  cat_type: CatVariant;
}

export class PaginationParamsDTO implements IPaginationParams {
  @ApiProperty({
    description: 'The page number',
    example: 1,
  })
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty({
    description: 'The number of items per page',
    example: 10,
  })
  @IsInt()
  @Min(1)
  limit: number;

  //a search string
  @ApiProperty({
    description: 'The search string',
    example: 'Fluffy',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}

export class PaginationResultDTO<T> implements IPaginationResult<T> {
  @ApiProperty({
    description: 'The total number of items',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'The list of items',
    type: Array<T>,
  })
  items: Array<T>;

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

function differenceInYears(currentDate: Date, birthday: Date): number {
  const diffInMilliseconds = currentDate.getTime() - birthday.getTime();
  const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;
  const diffInYears = diffInMilliseconds / millisecondsInYear;
  return Math.floor(diffInYears);
}

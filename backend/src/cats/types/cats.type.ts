import { CatVariant } from '../cat-type.entity';
import { CatVote } from '../cats.entity';

export interface ICat {
  id?: string;
  name: string;
  birthday: Date;
  location: string;
  favorite_food: string;
  fur_color: string;
  height: number;
  weight: number;
  image_url: string;
  likes?: CatVote[];
  likeCount?: number;
  likedByUser?: boolean;
  cat_type: CatVariant;
}

export interface IPaginationParams {
  page: number;
  limit: number;
  search?: string;
}

export interface IVoteForCatParams {
  catId: string;
  userId: string;
}

export interface IQueryCatsParams extends IVoteForCatParams {}

export interface IPaginationResult<T> {
  items: T[];
  hasNext: boolean;
  hasPrev: boolean;
  total: number;
}

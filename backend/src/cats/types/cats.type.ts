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
}

export interface IPaginationParams {
  page: number;
  limit: number;
}

export interface IVoteForCatParams {
  catId: string;
  userId: string;
}

export interface IPaginationResult<T> {
  items: T[];
  hasNext: boolean;
  hasPrev: boolean;
  total: number;
}

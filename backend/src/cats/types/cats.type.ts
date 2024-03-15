export interface ICat {
  name: string;
  birthday: Date;
  age: number;
  location: string;
  favoriteFood: string;
  furColor: string;
  height: number;
  weight: number;
  imageUrl: string;
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

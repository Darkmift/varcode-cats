import { CatVariant } from '@/cats/cat-type.entity';

export interface ILoginParams {
  username: string;
  password: string;
}

export enum Role {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super-admin',
  USER = 'user',
}

export interface ILoginResult {
  token: string;
  role: Role;
  username: string;
  lastname: string;
  firstname: string;
  cat_type_id: string;
}

export interface IUser {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  cat_type_id: string;
}

export interface IAdmin {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  email: string;
  accessLevel: Role.ADMIN | Role.SUPER_ADMIN;
}

export interface JwtDecodedPayload {
  username: string;
  id: string;
  role: Role;
  cat_type_id: string;
}

export enum LevelEnum {
  TYPE_1 = 1,
  TYPE_2 = 2,
  TYPE_3 = 3,
  TYPE_4 = 4,
  TYPE_5 = 5,
}

export interface IUserParams {
  cat_type_id: string;
  role: Role;
  userId: string;
}

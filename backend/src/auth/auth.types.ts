export interface ILoginParams {
  username: string;
  password: string;
}

export interface ILoginResult {
  token: string;
  role: 'admin' | 'user';
  username: string;
  lastname: string;
  firstname: string;
}

export interface IUser {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
}

export interface IAdmin {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  email: string;
  accessLevel: 'admin' | 'super-admin';
}

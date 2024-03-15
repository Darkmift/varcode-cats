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

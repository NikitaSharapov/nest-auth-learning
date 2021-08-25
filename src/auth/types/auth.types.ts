export interface IUser {
  id?: string;
  login: string;
  passwordHash: string;
}

export interface ILoginData {
  login: string;
  password?: string;
}

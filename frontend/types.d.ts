export interface UserFormData {
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  passwordCheck: string;
}

export interface LoginFormData {
  login: string;
  password: string;
}

export interface UserData {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  profilePicturePath: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserFormData {
  username: string;
  email: string;
  password: string;
  passwordCheck: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UserData {
  id: number;
  email: string;
  password: string;
  profilePicturePath: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiMessage {
  message: string;
}

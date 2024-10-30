export interface UserFormData {
  username: string;
  email: string;
  password: string;
  passwordCheck: string;
}

export interface UserUpdateFormData {
  username: string;
  file?: File;
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

export interface ConversationFormData {
  name: string;
  file?: File;
}

export interface Conversation {
  id: string;
  name: string;
  imagePath?: string | null;
  createdAt: string;
  updatedAt: string;
}

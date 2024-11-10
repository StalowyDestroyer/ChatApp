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
  username: string;
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

//Socket types
export interface SocketMessagePayload {
  roomID: string;
  message: Message;
  userID: number;
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
}

export interface ReciveMessageData {
  user: UserData;
  message: Message;
  roomID: string;
}

export interface Invitation {
  id: number;
  inviter: UserData;
  conversation: Conversation;
}

export interface File {
  name: string;
  type: string;
  preview: string | null;
  size: number;
}
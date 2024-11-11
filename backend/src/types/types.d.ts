export interface UserFilter {
  id?: number;
  username?: string;
  email?: string;
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
  files: any[];
}

export interface MessgaeFile {
  id: number;
  messageID: number;
  path: string;
  type: string;
  orginalName: string;
  updatedAt: string;
  createdAt: string;
}

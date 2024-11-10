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

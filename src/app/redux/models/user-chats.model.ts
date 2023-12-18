export interface MessagesInfo {
  authorID: string;
  message: string;
  createdAt: string;
  isMyMessage: boolean;
}

export interface UserChat {
  id: string;
  messages: MessagesInfo[];
  lastRequestAt: string;
}

export interface UserChatsState {
  chats: UserChat[];
  errorMessage: string;
}

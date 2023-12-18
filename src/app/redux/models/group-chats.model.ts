export interface MessagesInfo {
  authorID: string;
  message: string;
  createdAt: string;
  isMyMessage: boolean;
}

export interface GroupChat {
  id: string;
  messages: MessagesInfo[];
  lastRequestAt: string;
}

export interface GroupChatsState {
  chats: GroupChat[];
  errorMessage: string;
}

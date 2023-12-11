export interface UsersData {
  id: string;
  name: string;
}

export interface ConversationsData {
  id: string;
  companionID: string;
}

export interface UsersState {
  users: {
    Count: number;
    data: UsersData[];
    errorMessage: string;
  };
  conversations: {
    Count: number;
    data: ConversationsData[];
  };
}

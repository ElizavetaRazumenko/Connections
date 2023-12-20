import { createReducer, on } from '@ngrx/store';

import * as UserChatsActions from '../actions/user-chats.action';
import { UserChatsState } from '../models/user-chats.model';

export const userChatsNode = 'userChats';
export const initialState: UserChatsState = {
  chats: [],
  errorMessage: ''
};

export const userChatsReducer = createReducer(
  initialState,
  on(
    UserChatsActions.chatsSaveDataAction,
    (state: UserChatsState, { chatData }): UserChatsState => {
      let currentChat = state.chats.find((chat) => chat.id === chatData.id);
      if (currentChat) {
        currentChat = {
          ...currentChat,
          messages: [...currentChat.messages, ...chatData.messages]
        };
        return {
          ...state,
          chats: [
            ...state.chats.filter((chat) => chat.id !== chatData.id),
            currentChat
          ]
        };
      }
      return {
        ...state,
        chats: [...state.chats, chatData]
      };
    }
  ),
  on(
    UserChatsActions.chatsRemoveChatAction,
    (state: UserChatsState, { id }): UserChatsState => ({
      ...state,
      chats: [...state.chats.filter((chat) => chat.id !== id)]
    })
  ),
  on(
    UserChatsActions.chatsErrorAction,
    (state: UserChatsState, { message }): UserChatsState => ({
      ...state,
      errorMessage: message
    })
  ),
  on(
    UserChatsActions.chatsUsersClearAction,
    (state: UserChatsState): UserChatsState => ({
      ...state,
      chats: [],
      errorMessage: ''
    })
  )
);

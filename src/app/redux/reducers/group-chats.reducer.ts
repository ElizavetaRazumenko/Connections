import { createReducer, on } from '@ngrx/store';

import * as GroupChatsActions from '../actions/group-chats.action';
import { GroupChatsState } from '../models/group-chats.model';

export const groupChatsNode = 'groupChats';
export const initialState: GroupChatsState = {
  chats: [],
  errorMessage: ''
};

export const groupChatsReducer = createReducer(
  initialState,
  on(
    GroupChatsActions.chatsSaveDataAction,
    (state: GroupChatsState, { chatData }): GroupChatsState => {
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
    GroupChatsActions.chatsRemoveChatAction,
    (state: GroupChatsState, { id }): GroupChatsState => ({
      ...state,
      chats: [...state.chats.filter((chat) => chat.id !== id)]
    })
  ),
  on(
    GroupChatsActions.chatsErrorAction,
    (state: GroupChatsState, { message }): GroupChatsState => ({
      ...state,
      errorMessage: message
    })
  ),
  on(
    GroupChatsActions.chatsClearAction,
    (state: GroupChatsState): GroupChatsState => ({
      ...state,
      chats: [],
      errorMessage: ''
    })
  )
);

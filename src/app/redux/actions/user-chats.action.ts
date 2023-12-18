import { createAction, props } from '@ngrx/store';
import { UserChat } from '../models/user-chats.model';

export enum UserChatsType {
  saveChatsData = '[user chats] saveChatsData',
  sendChatsRequest = '[user chats] sendChatsRequest',
  sendChatsNoTimerRequest = '[user chats] sendChatsNoTimerRequest',
  removeChat = '[user chats] removeChat',
  error = '[user chats] error'
}

export const chatsSaveDataAction = createAction(
  UserChatsType.saveChatsData,
  props<{ chatData: UserChat }>()
);

export const chatsSendDataAction = createAction(
  UserChatsType.sendChatsRequest,
  props<{ id: string; since?: number }>()
);

export const chatsSendDataNoTimerAction = createAction(
  UserChatsType.sendChatsNoTimerRequest,
  props<{ id: string; since?: number }>()
);

export const chatsRemoveChatAction = createAction(
  UserChatsType.removeChat,
  props<{ id: string }>()
);

export const chatsErrorAction = createAction(
  UserChatsType.error,
  props<{ message: string }>()
);

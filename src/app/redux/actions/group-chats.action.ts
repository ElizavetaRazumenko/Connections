import { createAction, props } from '@ngrx/store';
import { GroupChat } from '../models/group-chats.model';

export enum GroupChatsType {
  saveChatsData = '[group chats] saveChatsData',
  sendChatsRequest = '[group chats] sendChatsRequest',
  sendChatsNoTimerRequest = '[group chats] sendChatsNoTimerRequest',
  removeChat = '[group chats] removeChat',
  error = '[group chats] error'
}

export const chatsSaveDataAction = createAction(
  GroupChatsType.saveChatsData,
  props<{ chatData: GroupChat }>()
);

export const chatsSendDataAction = createAction(
  GroupChatsType.sendChatsRequest,
  props<{ id: string; since?: number }>()
);

export const chatsSendDataNoTimerAction = createAction(
  GroupChatsType.sendChatsNoTimerRequest,
  props<{ id: string; since?: number }>()
);

export const chatsRemoveChatAction = createAction(
  GroupChatsType.removeChat,
  props<{ id: string }>()
);

export const chatsErrorAction = createAction(
  GroupChatsType.error,
  props<{ message: string }>()
);

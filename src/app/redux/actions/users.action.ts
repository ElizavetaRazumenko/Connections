import { createAction, props } from '@ngrx/store';
import { ConversationsData, UsersData } from '../models/users.model';

export enum UsersType {
  saveUsersData = '[users] saveUsersData',
  saveConversationsData = '[users] saveConversationsData',
  addConversationData = '[users] addConversationData',
  removeConversationData = '[users] removeConversationData',
  getUsersDataRequest = '[users] getUsersDataRequest',
  getUsersDataNoTimerRequest = '[users] getUsersDataNoTimerRequest',
  getConversationRequest = '[users] getConversationRequest',
  error = '[users] error',
  clear = '[users] clear'
}

export const usersSaveDataAction = createAction(
  UsersType.saveUsersData,
  props<{ usersData: UsersData[] }>()
);

export const usersGetRequestDataAction = createAction(
  UsersType.getUsersDataRequest
);

export const usersGetRequestDataNoTimerAction = createAction(
  UsersType.getUsersDataNoTimerRequest
);

export const usersGetConversationDataAction = createAction(
  UsersType.getConversationRequest
);

export const usersSaveConversationsAction = createAction(
  UsersType.saveConversationsData,
  props<{ conversationsData: ConversationsData[] }>()
);

export const usersAddConversationAction = createAction(
  UsersType.addConversationData,
  props<{ conversationsData: ConversationsData }>()
);

export const usersRemoveConversationAction = createAction(
  UsersType.removeConversationData,
  props<{ id: string }>()
);

export const usersErrorAction = createAction(
  UsersType.error,
  props<{ message: string }>()
);

export const usersClearAction = createAction(UsersType.clear);

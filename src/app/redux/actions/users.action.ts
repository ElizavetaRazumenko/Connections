import { createAction, props } from '@ngrx/store';
import { ConversationsData, UsersData } from '../models/users.model';

export enum UsersType {
  saveUsersData = '[users] saveUsersData',
  saveConversationsData = '[users] saveConversationsData',
  getUsersDataRequest = '[users] getUsersDataRequest',
  getConversationRequest = '[users] getConversationRequest',
  error = '[users] error'
}

export const usersSaveDataAction = createAction(
  UsersType.saveUsersData,
  props<{ usersData: UsersData[] }>()
);

export const usersGetRequestDataAction = createAction(
  UsersType.getUsersDataRequest
);

export const usersGetConversationDataAction = createAction(
  UsersType.getConversationRequest
);

export const usersSaveConversationsAction = createAction(
  UsersType.saveConversationsData,
  props<{ conversationsData: ConversationsData[] }>()
);

export const usersErrorAction = createAction(
  UsersType.error,
  props<{ message: string }>()
);

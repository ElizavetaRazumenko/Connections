import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserChat, UserChatsState } from '../models/user-chats.model';
import { userChatsNode } from '../reducers/user-chats.reducer';

const selectUserChatsFeature =
  createFeatureSelector<UserChatsState>(userChatsNode);

export const selectUserChatsData = createSelector(
  selectUserChatsFeature,
  (state: UserChatsState): UserChat[] => state.chats
);

export const selectUserChatsError = createSelector(
  selectUserChatsFeature,
  (state: UserChatsState): string => state.errorMessage
);

import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ConversationsData,
  UsersData,
  UsersState
} from '../models/users.model';
import { usersNode } from '../reducers/users.reducer';

const selectUsersFeature = createFeatureSelector<UsersState>(usersNode);

export const selectUsersData = createSelector(
  selectUsersFeature,
  (state: UsersState): UsersData[] => state.users.data
);

export const selectConversationsData = createSelector(
  selectUsersFeature,
  (state: UsersState): ConversationsData[] => state.conversations.data
);

export const selectUsersCount = createSelector(
  selectUsersFeature,
  (state: UsersState): number => state.users.Count
);

export const selectUsersError = createSelector(
  selectUsersFeature,
  (state: UsersState): string => state.users.errorMessage
);

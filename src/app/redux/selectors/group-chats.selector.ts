import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GroupChat, GroupChatsState } from '../models/group-chats.model';
import { groupChatsNode } from '../reducers/group-chats.reducer';

const selectGroupChatsFeature =
  createFeatureSelector<GroupChatsState>(groupChatsNode);

export const selectGroupChatsData = createSelector(
  selectGroupChatsFeature,
  (state: GroupChatsState): GroupChat[] => state.chats
);

export const selectGroupChatsError = createSelector(
  selectGroupChatsFeature,
  (state: GroupChatsState): string => state.errorMessage
);

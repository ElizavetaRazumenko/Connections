import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GroupData, GroupState } from '../models/group.model';
import { groupNode } from '../reducers/group.reducer';

const selectGroupFeature = createFeatureSelector<GroupState>(groupNode);

export const selectGroupsData = createSelector(
  selectGroupFeature,
  (state: GroupState): GroupData[] => state.group.data
);

export const selectGroupCount = createSelector(
  selectGroupFeature,
  (state: GroupState): number => state.group.Count
);

export const selectGroupError = createSelector(
  selectGroupFeature,
  (state: GroupState): string => state.group.errorMessage
);

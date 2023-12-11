import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProfileData, ProfileState } from '../models/profile.model';
import { profileNode } from '../reducers/profile.reducer';

const selectProfileFeature = createFeatureSelector<ProfileState>(profileNode);

export const selectProfileData = createSelector(
  selectProfileFeature,
  (state: ProfileState): ProfileData => state.profile.data
);

export const selectProfileError = createSelector(
  selectProfileFeature,
  (state: ProfileState): string => state.profile.errorMessage
);

import { createReducer, on } from '@ngrx/store';

import * as ProfileActions from '../actions/profile.action';
import { ProfileState } from '../models/profile.model';

export const profileNode = 'profile';
export const initialState: ProfileState = {
  profile: {
    email: '',
    name: '',
    uid: '',
    createdAt: ''
  }
};

export const profileReducer = createReducer(
  initialState,
  on(
    ProfileActions.profileSaveDataAction,
    (state: ProfileState, { profileData }): ProfileState => ({
      ...state,
      profile: profileData
    })
  )
);

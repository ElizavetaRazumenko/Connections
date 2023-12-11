import { createReducer, on } from '@ngrx/store';

import * as ProfileActions from '../actions/profile.action';
import { ProfileState } from '../models/profile.model';

export const profileNode = 'profile';
export const initialState: ProfileState = {
  profile: {
    data: {
      email: '',
      name: '',
      uid: '',
      createdAt: '',
      isDataBeenReceived: false
    },
    errorMessage: ''
  }
};

export const profileReducer = createReducer(
  initialState,
  on(
    ProfileActions.profileSaveDataAction,
    (state: ProfileState, { profileData }): ProfileState => ({
      ...state,
      profile: {
        ...state.profile,
        data: profileData
      }
    })
  ),
  on(
    ProfileActions.profileErrorAction,
    (state: ProfileState, { message }): ProfileState => ({
      ...state,
      profile: {
        ...state.profile,
        errorMessage: message
      }
    })
  ),
  on(
    ProfileActions.profileSetNameAction,
    (state: ProfileState, { name }): ProfileState => ({
      ...state,
      profile: {
        ...state.profile,
        data: {
          ...state.profile.data,
          name
        }
      }
    })
  )
);

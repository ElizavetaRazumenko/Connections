import { createAction, props } from '@ngrx/store';
import { ProfileData } from '../models/profile.model';

export enum ProfileType {
  saveProfileData = '[profile] saveProfileData',
  sendUserData = '[profile] sendUserData',
  error = '[profile] error',
  setName = '[profile] setName'
}

export const profileSaveDataAction = createAction(
  ProfileType.saveProfileData,
  props<{ profileData: ProfileData }>()
);

export const profileSendUserDataAction = createAction(ProfileType.sendUserData);

export const profileErrorAction = createAction(
  ProfileType.error,
  props<{ message: string }>()
);

export const profileSetNameAction = createAction(
  ProfileType.setName,
  props<{ name: string }>()
);

import { createAction, props } from '@ngrx/store';
import { ProfileData } from '../models/profile.model';

export enum ProfileType {
  saveProfileData = '[profile] saveProfileData',
  sendUserData = '[profile] sendUserData'
}

export const profileSaveDataAction = createAction(
  ProfileType.saveProfileData,
  props<{ profileData: ProfileData }>()
);

export const profileSendUserDataAction = createAction(
  ProfileType.sendUserData,
  props<{ 'rs-uid': string; 'rs-email': string; Authorization: string }>()
);

import { createAction, props } from '@ngrx/store';
import { GroupData } from '../models/group.model';

export enum GroupeType {
  saveGroupsData = '[group] saveGroupsData',
  addGroup = '[group] addGroup',
  sendGroupData = '[group] sendGroupData',
  getGroupDataRequest = '[group] getGroupDataRequest',
  getGroupDataNoTimerRequest = '[group] getGroupDataNoTimerRequest',
  removeGroup = '[group] removeGroup',
  error = '[group] error',
  clear = '[group] clear'
}

export const groupSaveDataAction = createAction(
  GroupeType.saveGroupsData,
  props<{ groupsData: GroupData[] }>()
);

export const groupAddGroupAction = createAction(
  GroupeType.addGroup,
  props<{ groupData: GroupData }>()
);

export const groupGetRequestDataAction = createAction(
  GroupeType.getGroupDataRequest
);

export const groupGetRequestDataNoTimerAction = createAction(
  GroupeType.getGroupDataNoTimerRequest
);

export const groupRemoveGroupAction = createAction(
  GroupeType.removeGroup,
  props<{ id: string }>()
);

export const groupErrorAction = createAction(
  GroupeType.error,
  props<{ message: string }>()
);

export const groupClearAction = createAction(GroupeType.clear);

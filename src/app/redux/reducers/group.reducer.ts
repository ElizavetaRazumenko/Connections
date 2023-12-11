import { createReducer, on } from '@ngrx/store';

import * as GroupActions from '../actions/group.action';
import { GroupState } from '../models/group.model';

export const groupNode = 'group';
export const initialState: GroupState = {
  group: {
    Count: 0,
    data: [],
    errorMessage: ''
  }
};

export const groupReducer = createReducer(
  initialState,
  on(
    GroupActions.groupSaveDataAction,
    (state: GroupState, { groupsData }): GroupState => ({
      ...state,
      group: {
        ...state.group,
        data: [...groupsData]
      }
    })
  ),
  on(
    GroupActions.groupRemoveGroupAction,
    (state: GroupState, { id }): GroupState => ({
      ...state,
      group: {
        ...state.group,
        data: [...state.group.data.filter((group) => group.id !== id)]
      }
    })
  ),
  on(
    GroupActions.groupErrorAction,
    (state: GroupState, { message }): GroupState => ({
      ...state,
      group: {
        ...state.group,
        errorMessage: message
      }
    })
  ),
  on(
    GroupActions.groupAddGroupAction,
    (state: GroupState, { groupData }): GroupState => ({
      ...state,
      group: {
        ...state.group,
        data: [groupData, ...state.group.data]
      }
    })
  )
);

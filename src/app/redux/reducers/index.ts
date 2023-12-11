import { ActionReducerMap } from '@ngrx/store';

import { State } from '../models/state.model';
import { profileNode, profileReducer } from './profile.reducer';
import { alertNode, alertReducer } from './alert.reducer';
import { timerGroupNode, timerGroupReducer } from './timerGroup.reducer';
import { groupNode, groupReducer } from './group.reducer';
import { modalNode, modalReducer } from './modal.reducer';
import { timerUsersNode, timerUsersReducer } from './timerUsers.reducer';
import { usersNode, usersReducer } from './users.reducer';
import { groupChatsNode, groupChatsReducer } from './group-chats.reducer';
import {
  timerGroupChatsNode,
  timerGroupChatsReducer
} from './timerGroupChats.reducer';

export const reducers: ActionReducerMap<State> = {
  [profileNode]: profileReducer,
  [alertNode]: alertReducer,
  [timerGroupNode]: timerGroupReducer,
  [timerUsersNode]: timerUsersReducer,
  [timerGroupChatsNode]: timerGroupChatsReducer,
  [groupNode]: groupReducer,
  [usersNode]: usersReducer,
  [modalNode]: modalReducer,
  [groupChatsNode]: groupChatsReducer
};

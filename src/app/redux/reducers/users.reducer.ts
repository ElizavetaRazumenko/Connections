import { createReducer, on } from '@ngrx/store';

import * as UsersActions from '../actions/users.action';
import { UsersState } from '../models/users.model';

export const usersNode = 'users';
export const initialState: UsersState = {
  users: {
    Count: 0,
    data: [],
    errorMessage: ''
  },
  conversations: {
    Count: 0,
    data: []
  }
};

export const usersReducer = createReducer(
  initialState,
  on(
    UsersActions.usersSaveDataAction,
    (state: UsersState, { usersData }): UsersState => ({
      ...state,
      users: {
        ...state.users,
        data: [...usersData]
      }
    })
  ),
  on(
    UsersActions.usersSaveConversationsAction,
    (state: UsersState, { conversationsData }): UsersState => ({
      ...state,
      conversations: {
        ...state.conversations,
        data: [...conversationsData]
      }
    })
  )
);

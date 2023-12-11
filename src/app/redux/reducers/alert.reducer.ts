import { createReducer, on } from '@ngrx/store';

import * as AlertActions from '../actions/alert.action';
import { AlertState } from '../models/alert.model';

export const alertNode = 'alert';
export const initialState: AlertState = {
  alert: []
};

export const alertReducer = createReducer(
  initialState,
  on(
    AlertActions.alertAddAlertAction,
    (state: AlertState, { notify }): AlertState => ({
      ...state,
      alert: [...state.alert, notify]
    })
  ),
  on(
    AlertActions.alertDeleteNotifyAction,
    (state: AlertState, { id }): AlertState => ({
      ...state,
      alert: [...state.alert.filter((alert) => alert.id !== id)]
    })
  )
);

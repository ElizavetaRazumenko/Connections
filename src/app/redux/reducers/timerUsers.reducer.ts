import { createReducer, on } from '@ngrx/store';

import * as TimerActions from '../actions/timerUsers.action';
import { TimerState } from '../models/timer.model';

export const timerUsersNode = 'timerUsers';
export const initialState: TimerState = {
  timer: {
    isVisible: false,
    shouldBeStartCounted: false,
    canBeUpdate: true,
    minutes: 1,
    seconds: 60,
    timerFlag: false
  }
};

export const timerUsersReducer = createReducer(
  initialState,
  on(
    TimerActions.timerUsersChangeVisabilityAction,
    (state: TimerState, { isVisible }): TimerState => ({
      ...state,
      timer: {
        ...state.timer,
        isVisible
      }
    })
  ),
  on(
    TimerActions.timerUsersChangeMinutesAction,
    (state: TimerState, { minutes }): TimerState => ({
      ...state,
      timer: {
        ...state.timer,
        minutes
      }
    })
  ),
  on(
    TimerActions.timerUsersChangeSecondsAction,
    (state: TimerState, { seconds }): TimerState => ({
      ...state,
      timer: {
        ...state.timer,
        seconds
      }
    })
  ),
  on(
    TimerActions.timerUsersCanBeUpdateAction,
    (state: TimerState, { canBeUpdate }): TimerState => ({
      ...state,
      timer: {
        ...state.timer,
        canBeUpdate
      }
    })
  ),
  on(
    TimerActions.timerUsersStartCountedAction,
    (state: TimerState, { shouldBeStartCounted }): TimerState => ({
      ...state,
      timer: {
        ...state.timer,
        shouldBeStartCounted
      }
    })
  ),
  on(
    TimerActions.timerUsersChangeFlagAction,
    (state: TimerState, { timerFlag }): TimerState => ({
      ...state,
      timer: {
        ...state.timer,
        timerFlag
      }
    })
  )
);

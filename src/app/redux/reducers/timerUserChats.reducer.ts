import { createReducer, on } from '@ngrx/store';

import * as TimerActions from '../actions/timerUserChats.action';
import { TimerState } from '../models/timer.model';

export const timerUserChatsNode = 'timerUserChats';
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

export const timerUserChatsReducer = createReducer(
  initialState,
  on(
    TimerActions.timerChangeVisabilityAction,
    (state: TimerState, { isVisible }): TimerState => ({
      ...state,
      timer: {
        ...state.timer,
        isVisible
      }
    })
  ),
  on(
    TimerActions.timerChangeMinutesAction,
    (state: TimerState, { minutes }): TimerState => ({
      ...state,
      timer: {
        ...state.timer,
        minutes
      }
    })
  ),
  on(
    TimerActions.timerChangeSecondsAction,
    (state: TimerState, { seconds }): TimerState => ({
      ...state,
      timer: {
        ...state.timer,
        seconds
      }
    })
  ),
  on(
    TimerActions.timerCanBeUpdateAction,
    (state: TimerState, { canBeUpdate }): TimerState => ({
      ...state,
      timer: {
        ...state.timer,
        canBeUpdate
      }
    })
  ),
  on(
    TimerActions.timerStartCountedAction,
    (state: TimerState, { shouldBeStartCounted }): TimerState => ({
      ...state,
      timer: {
        ...state.timer,
        shouldBeStartCounted
      }
    })
  ),
  on(
    TimerActions.timerChangeFlagAction,
    (state: TimerState, { timerFlag }): TimerState => ({
      ...state,
      timer: {
        ...state.timer,
        timerFlag
      }
    })
  )
);

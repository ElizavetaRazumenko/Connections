import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Timer, TimerState, TimerTime } from '../models/timer.model';
import { timerUserChatsNode } from '../reducers/timerUserChats.reducer';

const selectTimerFeature =
  createFeatureSelector<TimerState>(timerUserChatsNode);

export const selectTimerVisability = createSelector(
  selectTimerFeature,
  (state: TimerState): boolean => state.timer.isVisible
);

export const selectTimerStarting = createSelector(
  selectTimerFeature,
  (state: TimerState): boolean => state.timer.shouldBeStartCounted
);

export const selectTimerTime = createSelector(
  selectTimerFeature,
  (state: TimerState): TimerTime => ({
    minutes: state.timer.minutes,
    seconds: state.timer.seconds
  })
);

export const selectTimerUpdating = createSelector(
  selectTimerFeature,
  (state: TimerState): boolean => state.timer.canBeUpdate
);

export const selectTimer = createSelector(
  selectTimerFeature,
  (state: TimerState): Timer => state.timer
);

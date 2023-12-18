import { createAction, props } from '@ngrx/store';

export enum TimerType {
  changeVisible = '[timerUserChats] changeVisible',
  startCounted = '[timerUserChats] startCounted',
  changeMinutes = '[timerUserChats] changeMinutes',
  changeSeconds = '[timerUserChats] changeSeconds',
  canBeUpdate = '[timerUserChats] canBeUpdate',
  timerFlag = '[timerUserChats] canBeUpdate'
}

export const timerChangeVisabilityAction = createAction(
  TimerType.changeVisible,
  props<{ isVisible: boolean }>()
);

export const timerStartCountedAction = createAction(
  TimerType.startCounted,
  props<{ shouldBeStartCounted: boolean }>()
);

export const timerChangeMinutesAction = createAction(
  TimerType.changeMinutes,
  props<{ minutes: number }>()
);

export const timerChangeSecondsAction = createAction(
  TimerType.changeSeconds,
  props<{ seconds: number }>()
);

export const timerCanBeUpdateAction = createAction(
  TimerType.canBeUpdate,
  props<{ canBeUpdate: boolean }>()
);

export const timerChangeFlagAction = createAction(
  TimerType.timerFlag,
  props<{ timerFlag: boolean }>()
);

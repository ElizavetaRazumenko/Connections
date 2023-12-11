import { createAction, props } from '@ngrx/store';

export enum TimerType {
  changeVisible = '[timerGroup] changeVisible',
  startCounted = '[timerGroup] startCounted',
  changeMinutes = '[timerGroup] changeMinutes',
  changeSeconds = '[timerGroup] changeSeconds',
  canBeUpdate = '[timerGroup] canBeUpdate',
  timerFlag = '[timerGroup] canBeUpdate'
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

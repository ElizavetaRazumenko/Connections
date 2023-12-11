import { createAction, props } from '@ngrx/store';

export enum TimerType {
  changeVisible = '[timerUsers] changeVisible',
  startCounted = '[timerUsers] startCounted',
  changeMinutes = '[timerUsers] changeMinutes',
  changeSeconds = '[timerUsers] changeSeconds',
  canBeUpdate = '[timerUsers] canBeUpdate',
  timerFlag = '[timerUsers] canBeUpdate'
}

export const timerUsersChangeVisabilityAction = createAction(
  TimerType.changeVisible,
  props<{ isVisible: boolean }>()
);

export const timerUsersStartCountedAction = createAction(
  TimerType.startCounted,
  props<{ shouldBeStartCounted: boolean }>()
);

export const timerUsersChangeMinutesAction = createAction(
  TimerType.changeMinutes,
  props<{ minutes: number }>()
);

export const timerUsersChangeSecondsAction = createAction(
  TimerType.changeSeconds,
  props<{ seconds: number }>()
);

export const timerUsersCanBeUpdateAction = createAction(
  TimerType.canBeUpdate,
  props<{ canBeUpdate: boolean }>()
);

export const timerUsersChangeFlagAction = createAction(
  TimerType.timerFlag,
  props<{ timerFlag: boolean }>()
);

import { createAction, props } from '@ngrx/store';

export enum TimerType {
  changeVisible = '[timerGroupChats] changeVisible',
  startCounted = '[timerGroupChats] startCounted',
  changeMinutes = '[timerGroupChats] changeMinutes',
  changeSeconds = '[timerGroupChats] changeSeconds',
  canBeUpdate = '[timerGroupChats] canBeUpdate',
  timerFlag = '[timerGroupChats] canBeUpdate'
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

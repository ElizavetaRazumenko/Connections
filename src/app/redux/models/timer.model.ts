export interface Timer extends TimerTime {
  isVisible: boolean;
  shouldBeStartCounted: boolean;
  canBeUpdate: boolean;
  timerFlag: boolean;
}

export interface TimerTime {
  minutes: number;
  seconds: number;
}

export interface TimerState {
  timer: Timer;
}

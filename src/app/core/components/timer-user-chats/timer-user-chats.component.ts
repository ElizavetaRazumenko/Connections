/* eslint-disable @ngrx/avoid-dispatching-multiple-actions-sequentially */
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  timerCanBeUpdateAction,
  timerChangeFlagAction,
  timerChangeMinutesAction,
  timerChangeSecondsAction,
  timerChangeVisabilityAction
} from 'src/app/redux/actions/timerUserChats.action';
import { Timer } from 'src/app/redux/models/timer.model';
import { selectTimer } from 'src/app/redux/selectors/timerUserChats.selector';

@Component({
  selector: 'app-timer-user-chats',
  templateUrl: './timer-user-chats.component.html',
  styleUrls: ['./timer-user-chats.component.scss']
})
export class TimerUserChatsComponent implements OnInit {
  private timer$ = this.store.select(selectTimer);
  private isTimerWork = false;
  public timer!: Timer;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.timer$.subscribe((timer) => {
      if (timer.timerFlag) {
        this.store.dispatch(timerChangeFlagAction({ timerFlag: false }));
        this.store.dispatch(timerCanBeUpdateAction({ canBeUpdate: false }));
        this.store.dispatch(timerChangeVisabilityAction({ isVisible: true }));

        this.countMinute(timer);
      }
    });
  }

  private countMinute(timer: Timer) {
    if (timer.minutes === 1) {
      this.store.dispatch(timerChangeMinutesAction({ minutes: 0 }));
      this.store.dispatch(timerChangeSecondsAction({ seconds: 59 }));
    }
    if (!this.isTimerWork) {
      this.isTimerWork = true;
      let secondsCount = 59;
      const intervalID = setInterval(() => {
        this.changeSeconds(secondsCount);

        if (secondsCount === 0) {
          clearInterval(intervalID);
          this.store.dispatch(
            timerChangeVisabilityAction({ isVisible: false })
          );
          this.store.dispatch(timerCanBeUpdateAction({ canBeUpdate: true }));
          this.store.dispatch(timerChangeMinutesAction({ minutes: 1 }));
          this.store.dispatch(timerChangeSecondsAction({ seconds: 60 }));
        }
        secondsCount = secondsCount - 1;
        this.isTimerWork = false;
      }, 1000);
    }
  }

  private changeSeconds(seconds: number) {
    this.store.dispatch(timerChangeSecondsAction({ seconds: seconds - 1 }));
  }
}

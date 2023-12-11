/* eslint-disable @ngrx/avoid-dispatching-multiple-actions-sequentially */
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  timerUsersCanBeUpdateAction,
  timerUsersChangeFlagAction,
  timerUsersChangeMinutesAction,
  timerUsersChangeSecondsAction,
  timerUsersChangeVisabilityAction
} from 'src/app/redux/actions/timerUsers.action';
import { Timer } from 'src/app/redux/models/timer.model';
import { selectTimer } from 'src/app/redux/selectors/timerUsers.selector';

@Component({
  selector: 'app-timer-users-counter',
  templateUrl: './timer-users-counter.component.html',
  styleUrls: ['./timer-users-counter.component.scss']
})
export class TimerUsersCounterComponent implements OnInit {
  private timer$ = this.store.select(selectTimer);
  private isTimerWork = false;
  public timer!: Timer;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.timer$.subscribe((timer) => {
      if (timer.timerFlag) {
        this.store.dispatch(timerUsersChangeFlagAction({ timerFlag: false }));
        this.store.dispatch(
          timerUsersCanBeUpdateAction({ canBeUpdate: false })
        );
        this.store.dispatch(
          timerUsersChangeVisabilityAction({ isVisible: true })
        );

        this.countMinute(timer);
      }
    });
  }

  private countMinute(timer: Timer) {
    if (timer.minutes === 1) {
      this.store.dispatch(timerUsersChangeMinutesAction({ minutes: 0 }));
      this.store.dispatch(timerUsersChangeSecondsAction({ seconds: 59 }));
    }
    if (!this.isTimerWork) {
      this.isTimerWork = true;
      let secondsCount = 59;
      const intervalID = setInterval(() => {
        this.changeSeconds(secondsCount);

        if (secondsCount === 0) {
          clearInterval(intervalID);
          this.store.dispatch(
            timerUsersChangeVisabilityAction({ isVisible: false })
          );
          this.store.dispatch(
            timerUsersCanBeUpdateAction({ canBeUpdate: true })
          );
          this.store.dispatch(timerUsersChangeMinutesAction({ minutes: 1 }));
          this.store.dispatch(timerUsersChangeSecondsAction({ seconds: 60 }));
        }
        secondsCount = secondsCount - 1;
        this.isTimerWork = false;
      }, 1000);
    }
  }

  private changeSeconds(seconds: number) {
    this.store.dispatch(
      timerUsersChangeSecondsAction({ seconds: seconds - 1 })
    );
  }
}

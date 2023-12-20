/* eslint-disable @ngrx/avoid-dispatching-multiple-actions-sequentially */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { alertAddAlertAction } from 'src/app/redux/actions/alert.action';
import { timerUsersStartCountedAction } from 'src/app/redux/actions/timerUsers.action';
import {
  usersGetConversationDataAction,
  usersGetRequestDataAction,
  usersGetRequestDataNoTimerAction
} from 'src/app/redux/actions/users.action';
import { Timer, TimerTime } from 'src/app/redux/models/timer.model';
import { UsersData } from 'src/app/redux/models/users.model';
import { selectTimer } from 'src/app/redux/selectors/timerUsers.selector';
import {
  selectUsersData,
  selectUsersError
} from 'src/app/redux/selectors/users.selector';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy {
  private ngSubscribe$ = new Subject<void>();

  public usersList$ = this.store.select(selectUsersData);
  private usersList!: UsersData[];

  public isButtonUpdateAble = true;

  private errorMessage$ = this.store.select(selectUsersError);

  private abilityToUpdate$ = this.applicationService.isUsersListCanBeUpdate$;
  private abilityToUpdate!: boolean;

  public timer$ = this.store.select(selectTimer);
  public timer!: Timer;
  public time: TimerTime = {
    minutes: 0,
    seconds: 0
  };

  private isUsersListShouldLoadData$ =
    this.applicationService.isUsersListShouldLoadData$;
  private isUsersListShouldLoadData!: boolean;

  constructor(
    private readonly store: Store,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.usersList$
      .pipe(takeUntil(this.ngSubscribe$))
      .subscribe((usersList) => {
        this.usersList = usersList;
      });

    this.abilityToUpdate$
      .pipe(takeUntil(this.ngSubscribe$))
      .subscribe((value) => {
        this.abilityToUpdate = value;
      });

    this.isUsersListShouldLoadData$
      .pipe(takeUntil(this.ngSubscribe$))
      .subscribe((value) => {
        this.isUsersListShouldLoadData = value;
        if (this.isUsersListShouldLoadData) {
          this.store.dispatch(usersGetRequestDataNoTimerAction());
          this.store.dispatch(usersGetConversationDataAction());
          this.applicationService.changeIsUsersListShouldLoadData(false);
        }
      });

    this.timer$.pipe(takeUntil(this.ngSubscribe$)).subscribe((timer) => {
      this.timer = timer;
      this.time = {
        minutes: timer.minutes,
        seconds: timer.seconds
      };

      if (timer.shouldBeStartCounted) {
        if (!this.usersList.length || this.abilityToUpdate) {
          this.store.dispatch(usersGetRequestDataAction());
          this.store.dispatch(usersGetConversationDataAction());
        }
        this.store.dispatch(
          timerUsersStartCountedAction({ shouldBeStartCounted: false })
        );
      }
    });

    this.errorMessage$
      .pipe(takeUntil(this.ngSubscribe$))
      .subscribe((message) => {
        if (message) {
          this.store.dispatch(
            alertAddAlertAction({
              notify: {
                message: 'Something went wrong, please try again',
                isSuccess: false,
                id: window.crypto.randomUUID()
              }
            })
          );
        }
      });
  }

  ngOnDestroy(): void {
    this.ngSubscribe$.next();
    this.ngSubscribe$.complete();
  }

  public updateUsers() {
    if (this.timer.canBeUpdate && this.isButtonUpdateAble) {
      this.isButtonUpdateAble = false;
      this.applicationService.changeIsUsersListUpdating(true);
      this.store.dispatch(
        timerUsersStartCountedAction({ shouldBeStartCounted: true })
      );
      setTimeout(() => {
        this.isButtonUpdateAble = true;
      }, 5000);
    }
  }
}

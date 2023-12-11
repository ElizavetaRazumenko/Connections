/* eslint-disable @ngrx/avoid-dispatching-multiple-actions-sequentially */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { alertAddAlertAction } from 'src/app/redux/actions/alert.action';
import { chatsSendDataAction } from 'src/app/redux/actions/group-chats.action';
import { timerStartCountedAction } from 'src/app/redux/actions/timerGroupChats.action';
import { MessagesInfo } from 'src/app/redux/models/group-chats.model';
import { Timer, TimerTime } from 'src/app/redux/models/timer.model';
import {
  selectGroupChatsData,
  selectGroupChatsError
} from 'src/app/redux/selectors/group-chats.selector';
import { selectTimer } from 'src/app/redux/selectors/timerGroupChats.selector';

@Component({
  selector: 'app-group-dialog',
  templateUrl: './group-dialog.component.html',
  styleUrls: ['./group-dialog.component.scss']
})
export class GroupDialogComponent implements OnInit, OnDestroy {
  public messageForm!: FormGroup<{
    message: FormControl<string | null>;
  }>;

  public currentId = '';

  private ngSubscribe$ = new Subject<void>();
  private errorMessage$ = this.store.select(selectGroupChatsError);

  public timer$ = this.store.select(selectTimer);
  public timer!: Timer;
  public time: TimerTime = {
    minutes: 0,
    seconds: 0
  };

  private chats$ = this.store.select(selectGroupChatsData);
  public messages!: MessagesInfo[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.messageForm = this.fb.group({
      message: ['', Validators.required]
    });

    this.route.params.subscribe((params) => {
      this.currentId = params['groupID'];
    });

    this.timer$.pipe(takeUntil(this.ngSubscribe$)).subscribe((timer) => {
      this.timer = timer;
      this.time = {
        minutes: timer.minutes,
        seconds: timer.seconds
      };

      if (timer.shouldBeStartCounted) {
        this.store.dispatch(chatsSendDataAction({ id: this.currentId }));
        this.store.dispatch(
          timerStartCountedAction({ shouldBeStartCounted: false })
        );
      }
    });

    this.chats$.pipe(takeUntil(this.ngSubscribe$)).subscribe((chats) => {
      const currentChat = chats.find((chat) => chat.id === this.currentId);
      if (currentChat) {
        this.messages = currentChat.messages;
      }
    });

    this.errorMessage$
      .pipe(takeUntil(this.ngSubscribe$))
      .subscribe((message) => {
        if (message) {
          let content = '';
          if (message.endsWith('was removed before.')) {
            content = 'Group does not exist or was removed before';
          } else {
            content = 'Something went wrong, please try again';
          }
          this.store.dispatch(
            alertAddAlertAction({
              notify: {
                message: content,
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

  public updateGroups() {
    if (this.timer.canBeUpdate) {
      this.store.dispatch(
        timerStartCountedAction({ shouldBeStartCounted: true })
      );
    }
  }

  public get message() {
    return this.messageForm.get('message') as FormControl<string | null>;
  }

  public toTheMain() {
    this.router.navigate(['/']);
  }
}

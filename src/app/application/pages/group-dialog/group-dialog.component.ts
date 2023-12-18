/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @ngrx/avoid-dispatching-multiple-actions-sequentially */
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, take, takeUntil } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { alertAddAlertAction } from 'src/app/redux/actions/alert.action';
import {
  chatsSendDataAction,
  chatsSendDataNoTimerAction
} from 'src/app/redux/actions/group-chats.action';
import {
  groupGetRequestDataNoTimerAction,
  groupRemoveGroupAction
} from 'src/app/redux/actions/group.action';
import {
  timerCanBeUpdateAction,
  timerChangeMinutesAction,
  timerChangeSecondsAction,
  timerStartCountedAction
} from 'src/app/redux/actions/timerGroupChats.action';
import { usersGetRequestDataNoTimerAction } from 'src/app/redux/actions/users.action';
import {
  GroupChat,
  MessagesInfo
} from 'src/app/redux/models/group-chats.model';
import { Timer, TimerTime } from 'src/app/redux/models/timer.model';
import {
  selectGroupChatsData,
  selectGroupChatsError
} from 'src/app/redux/selectors/group-chats.selector';
import { selectGroupsData } from 'src/app/redux/selectors/group.selector';
import { selectTimer } from 'src/app/redux/selectors/timerGroupChats.selector';
import { selectUsersData } from 'src/app/redux/selectors/users.selector';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-group-dialog',
  templateUrl: './group-dialog.component.html',
  styleUrls: ['./group-dialog.component.scss']
})
export class GroupDialogComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer', { static: false })
  messagesContainer!: ElementRef;

  public messageForm!: FormGroup<{
    message: FormControl<string | null>;
  }>;

  public currentId = '';
  public isOnDetelionMode = false;

  public isButtonUpdateAble = true;

  private ngSubscribe$ = new Subject<void>();
  private errorMessage$ = this.store.select(selectGroupChatsError);
  private currentChat!: GroupChat;
  public timer$ = this.store.select(selectTimer);
  private allGroups$ = this.store.select(selectGroupsData);
  private allUsers$ = this.store.select(selectUsersData);
  public isMyGroup = false;
  public timer!: Timer;
  public time: TimerTime = {
    minutes: 0,
    seconds: 0
  };

  private chats$ = this.store.select(selectGroupChatsData);
  public messages!: MessagesInfo[];

  public isButtonAble = true;

  private isFirstInitialization$ =
    this.applicationService.isGroupsChatFirstInitialization$;

  private isFirstInitialization!: boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private readonly store: Store,
    private httpService: HttpService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.messageForm = this.fb.group({
      message: ['', Validators.required]
    });

    this.route.params.subscribe((params) => {
      this.currentId = params['groupID'];
    });

    this.allUsers$.pipe(takeUntil(this.ngSubscribe$)).subscribe((users) => {
      if (!users.length) {
        this.store.dispatch(usersGetRequestDataNoTimerAction());
      }
    });

    this.allGroups$.pipe(takeUntil(this.ngSubscribe$)).subscribe((groups) => {
      if (groups.length) {
        const currentGroup = groups.find(
          (group) => group.id === this.currentId
        );
        if (currentGroup) {
          this.isMyGroup =
            currentGroup.createdBy === localStorage.getItem('uid');
        }
      } else {
        this.store.dispatch(groupGetRequestDataNoTimerAction());
        this.applicationService.changeIsGroupsListUpdating(false);
      }
    });

    this.chats$.pipe(takeUntil(this.ngSubscribe$)).subscribe((chats) => {
      const chat = chats.find((chat) => chat.id === this.currentId);
      if (chat) {
        this.currentChat = chat;
        this.messages = this.currentChat.messages;
        setTimeout(() => {
          if (this.messagesContainer) {
            this.messagesContainer.nativeElement.scrollTop =
              this.messagesContainer.nativeElement.scrollHeight;
          }
        });
      }
    });

    this.isFirstInitialization$.subscribe((value) => {
      this.isFirstInitialization = value;
    });

    if (!this.isFirstInitialization) {
      if (this.currentChat) {
        const params = this.configureParams();
        this.store.dispatch(chatsSendDataNoTimerAction(params));
      } else {
        this.store.dispatch(chatsSendDataNoTimerAction({ id: this.currentId }));
      }
    }

    this.timer$.pipe(takeUntil(this.ngSubscribe$)).subscribe((timer) => {
      this.timer = timer;
      this.time = {
        minutes: timer.minutes,
        seconds: timer.seconds
      };

      if (timer.shouldBeStartCounted) {
        if (this.currentChat) {
          const params = this.configureParams();
          this.store.dispatch(chatsSendDataAction(params));
        } else {
          this.store.dispatch(chatsSendDataAction({ id: this.currentId }));
        }
        this.store.dispatch(
          timerStartCountedAction({ shouldBeStartCounted: false })
        );
        this.applicationService.changeIsGroupsChatInitial(false);
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

  private configureParams() {
    const cloneMessages = Array.from(this.messages);
    cloneMessages.sort(
      (messageA, messageB) =>
        Number(messageA.createdAt) - Number(messageB.createdAt)
    );
    return cloneMessages[cloneMessages.length - 1]
      ? {
          id: this.currentId,
          since: +cloneMessages[cloneMessages.length - 1]!.createdAt
        }
      : {
          id: this.currentId,
          since: +this.currentChat.lastRequestAt
        };
  }

  public updateGroups() {
    if (this.timer.canBeUpdate && this.isButtonUpdateAble) {
      this.isButtonUpdateAble = false;
      this.store.dispatch(
        timerStartCountedAction({ shouldBeStartCounted: true })
      );
      setTimeout(() => {
        this.isButtonUpdateAble = true;
      }, 5000);
    }
  }

  public sentMessage() {
    if (this.message.value) {
      this.httpService
        .sendGroupMessage(this.currentId, this.message.value)
        .pipe(take(1))
        .subscribe({
          next: () => {
            if (this.currentChat) {
              const cloneMessages = Array.from(this.messages);
              cloneMessages.sort(
                (messageA, messageB) =>
                  Number(messageA.createdAt) - Number(messageB.createdAt)
              );
              const params = cloneMessages[cloneMessages.length - 1]
                ? {
                    id: this.currentId,
                    since: +cloneMessages[cloneMessages.length - 1]!.createdAt
                  }
                : {
                    id: this.currentId,
                    since: +this.currentChat.lastRequestAt
                  };
              this.store.dispatch(chatsSendDataNoTimerAction(params));
              this.messageForm.setValue({ message: '' });
            }
          },
          error: () => {
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
  }

  public get message() {
    return this.messageForm.get('message') as FormControl<string | null>;
  }

  public toTheMain() {
    this.router.navigate(['/']);
  }

  public openDeleteModal() {
    this.isOnDetelionMode = true;
  }

  public closeDeleteModal() {
    if (this.isButtonAble) {
      this.isOnDetelionMode = false;
    }
  }

  public deleteGroup() {
    if (this.isButtonAble) {
      this.isButtonAble = false;
      this.httpService
        .sendDeleteGroupRequest(this.currentId)
        .pipe(takeUntil(this.ngSubscribe$))
        .subscribe({
          next: () => {
            this.store.dispatch(groupRemoveGroupAction({ id: this.currentId }));

            this.store.dispatch(
              alertAddAlertAction({
                notify: {
                  message: 'The group deleted successfully',
                  isSuccess: true,
                  id: window.crypto.randomUUID()
                }
              })
            );
            this.router.navigate(['/']);
          },
          error: (error) => {
            const message = error.error.message;
            let reason = '';
            if (message.endsWith('removed before.')) {
              reason = 'Unsuccessful! The group has already been deleted';
            } else reason = 'Something went wrong, please try again';
            this.store.dispatch(
              alertAddAlertAction({
                notify: {
                  message: reason,
                  isSuccess: false,
                  id: window.crypto.randomUUID()
                }
              })
            );
            this.isButtonAble = true;
          }
        });
    }
  }
}

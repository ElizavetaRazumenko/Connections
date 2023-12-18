/* eslint-disable @ngrx/avoid-dispatching-multiple-actions-sequentially */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
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
import { timerStartCountedAction } from 'src/app/redux/actions/timerUserChats.action';
import {
  chatsSendDataAction,
  chatsSendDataNoTimerAction
} from 'src/app/redux/actions/user-chats.action';
import {
  usersGetRequestDataNoTimerAction,
  usersRemoveConversationAction
} from 'src/app/redux/actions/users.action';
import { Timer, TimerTime } from 'src/app/redux/models/timer.model';
import { MessagesInfo, UserChat } from 'src/app/redux/models/user-chats.model';
import { selectTimer } from 'src/app/redux/selectors/timerUserChats.selector';
import {
  selectUserChatsData,
  selectUserChatsError
} from 'src/app/redux/selectors/user-chats.selector';
import { selectUsersData } from 'src/app/redux/selectors/users.selector';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-users-dialogs',
  templateUrl: './users-dialogs.component.html',
  styleUrls: ['./users-dialogs.component.scss']
})
export class UsersDialogsComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer', { static: false })
  messagesContainer!: ElementRef;

  private ngSubscribe$ = new Subject<void>();
  public currentId = '';
  public timer$ = this.store.select(selectTimer);
  public timer!: Timer;
  public time: TimerTime = {
    minutes: 0,
    seconds: 0
  };

  public isOnDetelionMode = false;

  public isButtonAble = true;

  public isButtonUpdateAble = true;

  private chats$ = this.store.select(selectUserChatsData);
  private currentChat!: UserChat;

  public messages!: MessagesInfo[];

  private errorMessage$ = this.store.select(selectUserChatsError);
  private allUsers$ = this.store.select(selectUsersData);

  public messageForm!: FormGroup<{
    message: FormControl<string | null>;
  }>;

  private isFirstInitialization$ =
    this.applicationService.isUserChatFirstInitialization$;

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
      this.currentId = params['conversationID'];
    });

    this.allUsers$.pipe(takeUntil(this.ngSubscribe$)).subscribe((users) => {
      if (!users.length) {
        this.store.dispatch(usersGetRequestDataNoTimerAction());
        this.applicationService.changeIsUsersListUpdating(false);
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
      }
    });
    this.errorMessage$
      .pipe(takeUntil(this.ngSubscribe$))
      .subscribe((message) => {
        if (message) {
          let content = '';
          if (message.endsWith('was deleted before.')) {
            content = 'User does not exist or was deleted before';
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

  public updateDialog() {
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
        .sendMessageUsersChatRequest(this.currentId, this.message.value)
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

  public openDeleteModal() {
    this.isOnDetelionMode = true;
  }

  public closeDeleteModal() {
    if (this.isButtonAble) {
      this.isOnDetelionMode = false;
    }
  }

  public deleteChat() {
    if (this.isButtonAble) {
      this.isButtonAble = false;

      this.httpService
        .sendDeleteUsersChatRequest(this.currentId)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.store.dispatch(
              usersRemoveConversationAction({ id: this.currentId })
            );

            this.store.dispatch(
              alertAddAlertAction({
                notify: {
                  message: 'The chat deleted successfully',
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
              reason = 'Unsuccessful! This chat has already been deleted';
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

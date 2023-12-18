/* eslint-disable @ngrx/avoid-dispatching-multiple-actions-sequentially */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { ResponseConversationCreate } from 'src/app/core/services/http.service';
import { alertAddAlertAction } from 'src/app/redux/actions/alert.action';
import { usersAddConversationAction } from 'src/app/redux/actions/users.action';
import { ConversationsData, UsersData } from 'src/app/redux/models/users.model';
import { selectConversationsData } from 'src/app/redux/selectors/users.selector';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  private ngSubscribe$ = new Subject<void>();
  private conversationsList$ = this.store.select(selectConversationsData);

  private conversations!: ConversationsData[];
  public isOpenDialog = false;
  public currentUserId = localStorage.getItem('uid')
    ? localStorage.getItem('uid')
    : '';

  @Input() public userList!: UsersData;

  constructor(
    private store: Store,
    private router: Router,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.conversationsList$
      .pipe(takeUntil(this.ngSubscribe$))
      .subscribe((conversations) => {
        this.conversations = conversations;
        this.isOpenDialog = !!conversations.find(
          (item) => item.companionID === this.userList.id
        );
      });
  }

  ngOnDestroy(): void {
    this.ngSubscribe$.next();
    this.ngSubscribe$.complete();
  }

  public toTheUsersDialog() {
    const conversation = this.conversations.find(
      (conversation) => conversation.companionID === this.userList.id
    );
    if (conversation) {
      this.router.navigate([`/conversation/${conversation.id}`]);
    } else {
      this.applicationService.changeConversationAddQueryParams(
        this.userList.id
      );
      this.applicationService.conversationAddResponseID$
        .pipe(takeUntil(this.ngSubscribe$))
        .subscribe({
          next: (value) => {
            const body = value.body as ResponseConversationCreate;
            this.store.dispatch(
              usersAddConversationAction({
                conversationsData: {
                  id: body.conversationID,
                  companionID: this.userList.id
                }
              })
            );

            this.store.dispatch(
              alertAddAlertAction({
                notify: {
                  message: 'Dialog created successfully',
                  isSuccess: true,
                  id: window.crypto.randomUUID()
                }
              })
            );
            this.toTheUsersDialog();
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
}

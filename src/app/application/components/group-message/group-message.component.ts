import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, take, takeUntil } from 'rxjs';
import { MessagesInfo } from 'src/app/redux/models/group-chats.model';
import { selectUsersData } from 'src/app/redux/selectors/users.selector';

@Component({
  selector: 'app-group-message',
  templateUrl: './group-message.component.html',
  styleUrls: ['./group-message.component.scss']
})
export class GroupMessageComponent implements OnInit, OnDestroy {
  @Input() messageInfo!: MessagesInfo;

  public userName = '';
  private allUsers$ = this.store.select(selectUsersData);
  private ngSubscribe$ = new Subject<void>();
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.allUsers$
      .pipe(takeUntil(this.ngSubscribe$), take(2))
      .subscribe((users) => {
        if (users.length) {
          const currentUser = users.find(
            (user) => user.id === this.messageInfo.authorID
          );

          if (currentUser) {
            this.userName = currentUser.name;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.ngSubscribe$.next();
    this.ngSubscribe$.complete();
  }
}

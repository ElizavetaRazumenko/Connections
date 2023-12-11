import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { UsersData } from 'src/app/redux/models/users.model';
import { selectConversationsData } from 'src/app/redux/selectors/users.selector';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  private ngSubscribe$ = new Subject<void>();
  private conversationsList$ = this.store.select(selectConversationsData);

  public isOpenDialog = false;
  public currentUserId = localStorage.getItem('uid')
    ? localStorage.getItem('uid')
    : '';

  @Input() public userList!: UsersData;

  constructor(
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.conversationsList$
      .pipe(takeUntil(this.ngSubscribe$))
      .subscribe((conversations) => {
        this.isOpenDialog = !!conversations.find(
          (item) => item.id === this.userList.id
        );
      });
  }

  ngOnDestroy(): void {
    this.ngSubscribe$.next();
    this.ngSubscribe$.complete();
  }

  // public toTheGroupDialog() {
  //   this.router.navigate([`/group/${this.userList.id}`]);
  // }
}

/* eslint-disable @ngrx/avoid-dispatching-multiple-actions-sequentially */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { nameNotValid } from '../../validators/name.validator';
import { selectTimer } from 'src/app/redux/selectors/timerGroup.selector';
import {
  groupAddGroupAction,
  groupGetRequestDataAction,
  groupGetRequestDataNoTimerAction,
  groupRemoveGroupAction
} from 'src/app/redux/actions/group.action';
import {
  selectGroupError,
  selectGroupsData
} from 'src/app/redux/selectors/group.selector';
import { ApplicationService } from '../../services/application.service';
import { alertAddAlertAction } from 'src/app/redux/actions/alert.action';
import { Subject, take, takeUntil } from 'rxjs';
import { Timer, TimerTime } from 'src/app/redux/models/timer.model';
import { timerStartCountedAction } from 'src/app/redux/actions/timerGroup.action';
import { GroupService } from '../../services/group.service';
import { HttpService } from 'src/app/core/services/http.service';
import { GroupData } from 'src/app/redux/models/group.model';
import { ThemeService } from 'src/app/core/services/theme.service';

interface responseGroupID {
  groupID: string;
}

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss']
})
export class GroupsListComponent implements OnInit, OnDestroy {
  public groupsList$ = this.store.select(selectGroupsData);
  private groupsList!: GroupData[];
  private ngSubscribe$ = new Subject<void>();
  public isRequestCanBeSent = true;
  private errorMessage$ = this.store.select(selectGroupError);

  public isButtonUpdateAble = true;

  public isFormMode!: boolean;
  public isGroupDeletionMode!: boolean;
  private isFormMode$ = this.GroupServise.isFormMode$;
  private deletingGroupId$ = this.GroupServise.deletingGroupId$;
  private deletingGroupId!: string;
  private isGroupDeletionMode$ = this.GroupServise.isGroupDeletionMode$;
  private abilityToUpdate$ = this.applicationService.isGroupsListCanBeUpdate$;
  private abilityToUpdate!: boolean;
  private isGroupListShouldLoadData$ =
    this.applicationService.isGroupListShouldLoadData$;
  private isGroupListShouldLoadData!: boolean;

  public timer$ = this.store.select(selectTimer);
  public timer!: Timer;
  public time: TimerTime = {
    minutes: 0,
    seconds: 0
  };

  public createGroupForm!: FormGroup<{
    name: FormControl;
  }>;

  private currentTheme$ = this.themeService.currentTheme$;
  public currentTheme =
    localStorage.getItem('theme') === 'dark' ? 'dark' : 'ligth';

  constructor(
    private readonly store: Store,
    private fb: FormBuilder,
    private applicationService: ApplicationService,
    private GroupServise: GroupService,
    private httpService: HttpService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.createGroupForm = this.fb.group({
      name: ['', [Validators.required, nameNotValid, Validators.maxLength(30)]]
    });

    this.groupsList$
      .pipe(takeUntil(this.ngSubscribe$))
      .subscribe((groupsList) => {
        this.groupsList = groupsList;
      });

    this.abilityToUpdate$
      .pipe(takeUntil(this.ngSubscribe$))
      .subscribe((value) => {
        this.abilityToUpdate = value;
      });

    this.isGroupListShouldLoadData$
      .pipe(takeUntil(this.ngSubscribe$))
      .subscribe((value) => {
        this.isGroupListShouldLoadData = value;
        if (this.isGroupListShouldLoadData) {
          this.store.dispatch(groupGetRequestDataNoTimerAction());
          this.applicationService.changeIsGroupListShouldLoadData(false);
        }
      });

    this.timer$.pipe(takeUntil(this.ngSubscribe$)).subscribe((timer) => {
      this.timer = timer;
      this.time = {
        minutes: timer.minutes,
        seconds: timer.seconds
      };

      if (timer.shouldBeStartCounted) {
        if (!this.groupsList.length || this.abilityToUpdate) {
          this.store.dispatch(groupGetRequestDataAction());
        }
        this.store.dispatch(
          timerStartCountedAction({ shouldBeStartCounted: false })
        );
      }
    });

    this.isFormMode$.pipe(takeUntil(this.ngSubscribe$)).subscribe((value) => {
      this.isFormMode = value;
    });

    this.isGroupDeletionMode$
      .pipe(takeUntil(this.ngSubscribe$))
      .subscribe((value) => {
        this.isGroupDeletionMode = value;
      });

    this.deletingGroupId$
      .pipe(takeUntil(this.ngSubscribe$))
      .subscribe((id) => (this.deletingGroupId = id));

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

    this.currentTheme$.pipe(takeUntil(this.ngSubscribe$)).subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  ngOnDestroy(): void {
    this.ngSubscribe$.next();
    this.ngSubscribe$.complete();
  }

  public updateGroups() {
    if (this.timer.canBeUpdate && this.isButtonUpdateAble) {
      this.isButtonUpdateAble = false;
      this.applicationService.changeIsGroupsListUpdating(true);
      this.store.dispatch(
        timerStartCountedAction({ shouldBeStartCounted: true })
      );
      setTimeout(() => {
        this.isButtonUpdateAble = true;
      }, 5000);
    }
  }

  public onFormSublit() {
    if (!this.createGroupForm.invalid && this.isRequestCanBeSent) {
      this.isRequestCanBeSent = false;
      if (this.name.value) {
        this.applicationService.changeGroupNameQueryParams(this.name.value);
        this.applicationService.groupResponseID$.pipe(take(1)).subscribe({
          next: (response) => {
            const body = response.body as responseGroupID;

            this.store.dispatch(
              groupAddGroupAction({
                groupData: {
                  id: body.groupID,
                  name: this.name.value || '',
                  createdAt: `${new Date().getTime()}`,
                  createdBy: localStorage.getItem('uid') || ''
                }
              })
            );

            this.store.dispatch(
              alertAddAlertAction({
                notify: {
                  message: 'The group has been successfully created',
                  isSuccess: true,
                  id: window.crypto.randomUUID()
                }
              })
            );

            this.isRequestCanBeSent = true;
            this.fromTheFormMode();
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

            this.isRequestCanBeSent = true;
          }
        });
      }
    }
  }

  public toTheFormMode(event: MouseEvent) {
    this.GroupServise.toTheFormMode();
    event.stopPropagation();
  }

  public toTheGroupDeletionMode(event: MouseEvent) {
    this.GroupServise.toTheGroupDeletionMode();
    event.stopPropagation();
  }

  public fromTheFormMode() {
    if (this.isRequestCanBeSent) {
      this.GroupServise.fromTheFormMode();
      this.createGroupForm.setValue({ name: '' });
    }
  }

  public fromTheGroupDeletionMode() {
    if (this.isRequestCanBeSent) {
      this.GroupServise.fromTheGroupDeletionMode();
    }
  }

  public deleteGroup() {
    if (this.isRequestCanBeSent) {
      this.isRequestCanBeSent = false;
      this.httpService
        .sendDeleteGroupRequest(this.deletingGroupId)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.store.dispatch(
              groupRemoveGroupAction({ id: this.deletingGroupId })
            );

            this.store.dispatch(
              alertAddAlertAction({
                notify: {
                  message: 'The group deleted successfully',
                  isSuccess: true,
                  id: window.crypto.randomUUID()
                }
              })
            );
            this.isRequestCanBeSent = true;
            this.fromTheGroupDeletionMode();
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
            this.isRequestCanBeSent = true;
            this.fromTheGroupDeletionMode();
          }
        });
    }
  }

  public get name() {
    return this.createGroupForm.get('name') as FormControl<string | null>;
  }
}

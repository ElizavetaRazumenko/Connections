/* eslint-disable @ngrx/avoid-dispatching-multiple-actions-sequentially */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { loginNotValid } from 'src/app/auth/validators/login.validator';
import {
  profileSendUserDataAction,
  profileSetNameAction
} from 'src/app/redux/actions/profile.action';
import { ProfileData } from 'src/app/redux/models/profile.model';
import {
  selectProfileData,
  selectProfileError
} from 'src/app/redux/selectors/profile.selector';
import { ApplicationService } from '../../services/application.service';
import { alertAddAlertAction } from 'src/app/redux/actions/alert.action';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public currentName = '';
  public profileData$: Observable<ProfileData> =
    this.store.select(selectProfileData);

  private errorMessage$ = this.store.select(selectProfileError);
  private ngSubscribe$ = new Subject<void>();

  private profileResponseData$ = this.applicationService.profileResponseData$;

  public isOnEditionMode = false;
  public isRequestCanBeSent = true;

  public editionalForm!: FormGroup<{
    name: FormControl;
  }>;

  constructor(
    private readonly store: Store,
    private fb: FormBuilder,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.editionalForm = this.fb.group({
      name: ['', [Validators.required, loginNotValid, Validators.maxLength(40)]]
    });

    this.profileData$.pipe(takeUntil(this.ngSubscribe$)).subscribe((data) => {
      if (!data.isDataBeenReceived) {
        this.store.dispatch(profileSendUserDataAction());
      }
      if (data.name !== '') {
        this.editionalForm.setValue({ name: data.name });
        this.currentName = data.name;
      }
    });

    this.errorMessage$.pipe(take(1)).subscribe((message) => {
      if (message) this.sendNotifyErrorOnload(message);
    });
  }

  ngOnDestroy(): void {
    this.ngSubscribe$.next();
    this.ngSubscribe$.complete();
  }

  public onFormSubmit() {
    if (!this.editionalForm.invalid && this.isRequestCanBeSent) {
      this.isRequestCanBeSent = false;
      this.applicationService.changeNameQueryParams(this.name.value || '');
      this.profileResponseData$.pipe(take(1)).subscribe({
        next: () => {
          this.store.dispatch(
            profileSetNameAction({ name: this.name.value || '' })
          );

          this.store.dispatch(
            alertAddAlertAction({
              notify: {
                message: 'The name has been successfully changed',
                isSuccess: true,
                id: window.crypto.randomUUID()
              }
            })
          );

          this.isOnEditionMode = false;
          this.isRequestCanBeSent = true;
        },
        error: (error) => {
          this.sendNotify(error.error.message as string);
          this.isOnEditionMode = false;
          this.isRequestCanBeSent = true;
        }
      });
    }
  }

  public get name() {
    return this.editionalForm.get('name') as FormControl<string | null>;
  }

  private sendNotify(message: string) {
    let reason = '';
    if (message.endsWith('passed identificators.')) {
      reason = 'Unsuccessful! User is not found';
    } else if (message.endsWith('field.')) {
      reason = 'Unsuccessful! Please fill in the name field';
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
  }

  private sendNotifyErrorOnload(message: string) {
    let reason = '';
    if (message.endsWith('not found')) {
      reason = 'Unsuccessful! This user does not exist';
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
  }

  public toTheEditionMode() {
    this.isOnEditionMode = true;
    this.editionalForm.setValue({ name: this.currentName });
  }

  public toTheNormalMode() {
    if (this.isRequestCanBeSent) {
      this.isOnEditionMode = false;
    }
  }
}

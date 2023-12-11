import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { alertAddAlertAction } from 'src/app/redux/actions/alert.action';
import { Subject, takeUntil } from 'rxjs';

interface LoginResponseBody {
  token: string;
  uid: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm!: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl;
  }>;

  public loginResponseData$ = this.authService.loginResponseData$;
  private ngSubscribe$ = new Subject<void>();

  public canRequestBeSent = true;

  private isUserNotExist = false;
  private currentUserData = {
    email: '',
    password: ''
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.ngSubscribe$.next();
    this.ngSubscribe$.complete();
  }

  public get email() {
    return this.loginForm.get('email') as FormControl<string | null>;
  }

  public get password() {
    return this.loginForm.get('password') as FormControl;
  }

  public onFormSubmit() {
    if (this.canRequestBeSent) {
      this.canRequestBeSent = false;
      this.authService.changeLoginQueryParams(
        this.loginForm.controls.email.value || '',
        this.loginForm.controls.password.value || ''
      );

      this.loginResponseData$.pipe(takeUntil(this.ngSubscribe$)).subscribe({
        next: (response) => {
          this.saveLoginTokensToLS(response.body as LoginResponseBody);

          this.store.dispatch(
            alertAddAlertAction({
              notify: {
                message: 'User has successfully logged in',
                isSuccess: true,
                id: window.crypto.randomUUID()
              }
            })
          );

          this.authService.userLogin();
          this.router.navigate(['/']);
          this.canRequestBeSent = true;
        },
        error: (error) => {
          this.sendNotify(error.error.message as string);
          this.checkError(error.error.message as string);
        }
      });
    }
  }

  private checkError(message: string) {
    if (message.endsWith('exist in the system.')) {
      this.isUserNotExist = true;
      this.canRequestBeSent = false;

      this.currentUserData = {
        email: this.loginForm.controls.email.value || '',
        password: this.loginForm.controls.password.value || ''
      };
    }
  }

  public checkExistingError() {
    if (this.isUserNotExist) {
      this.isUserNotExist = false;
      this.canRequestBeSent = true;
    }
  }

  public goToTheRegisterPage() {
    this.router.navigate(['/signup']);
  }

  private saveLoginTokensToLS(body: LoginResponseBody) {
    localStorage.setItem('token', `Bearer ${body.token}`);
    localStorage.setItem('uid', body.uid);
    localStorage.setItem(
      'email',
      this.loginForm.controls.email.value as string
    );
  }

  private sendNotify(message: string) {
    let reason = '';
    if (message.endsWith('exist in the system.')) {
      reason = 'This user does not exist. Please register first';
    } else if (message.endsWith('are required.')) {
      reason = 'Unsuccessful! Please fill in all the fields';
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
}

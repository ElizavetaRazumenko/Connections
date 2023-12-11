import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { passwordNotStrength } from '../../validators/password.validator';
import { AuthService } from '../../services/auth.service';
import { loginNotValid } from '../../validators/login.validator';
import { Store } from '@ngrx/store';
import { alertAddAlertAction } from 'src/app/redux/actions/alert.action';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public registerForm!: FormGroup<{
    firstName: FormControl;
    email: FormControl<string | null>;
    password: FormControl;
  }>;

  public registrationResponseData$ = this.authService.registrationResponseData$;

  public isUserExist = false;
  public canRequestBeSent = true;
  public currentEmail = '';
  public isShowUserError = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: [
        '',
        [Validators.required, loginNotValid, Validators.maxLength(40)]
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordNotStrength]]
    });
  }

  public get firstName() {
    return this.registerForm.get('firstName') as FormControl<string | null>;
  }

  public get email() {
    return this.registerForm.get('email') as FormControl<string | null>;
  }

  public get password() {
    return this.registerForm.get('password') as FormControl;
  }

  public onFormSubmit() {
    if (this.canRequestBeSent) {
      this.isUserExist = false;
      this.canRequestBeSent = false;
      this.currentEmail = this.registerForm.controls.email.value || '';

      this.authService.changeRedistrationQueryParams(
        this.registerForm.controls.email.value || '',
        this.registerForm.controls.firstName.value || '',
        this.registerForm.controls.password.value || ''
      );

      this.registrationResponseData$.subscribe({
        next: () => {
          this.store.dispatch(
            alertAddAlertAction({
              notify: {
                message: 'User successfully registered',
                isSuccess: true,
                id: window.crypto.randomUUID()
              }
            })
          );

          this.router.navigate(['/signin']);
          this.canRequestBeSent = true;
        },
        error: (error) => {
          this.checkErrorMessage(error.error.message as string);
          this.sendNotify(error.error.message as string);
        }
      });
    }
  }

  private checkErrorMessage(message: string) {
    if (message.endsWith('already exists')) {
      this.isUserExist = true;
    }
  }

  public checkExistingError() {
    if (this.isUserExist) {
      if (this.currentEmail && this.currentEmail === this.email.value) {
        this.canRequestBeSent = false;
        this.isShowUserError = true;
      } else {
        this.canRequestBeSent = true;
        this.isShowUserError = false;
      }
    }
  }

  private sendNotify(message: string) {
    let reason = '';
    if (message.endsWith('already exists')) {
      reason = 'Unsuccessful! A user with this email already exists';
    } else if (message.endsWith('are required')) {
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

  public goToTheLoginPage() {
    this.router.navigate(['/signin']);
  }
}

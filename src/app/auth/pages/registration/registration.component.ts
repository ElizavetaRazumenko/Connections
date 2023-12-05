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

interface InfoNotify {
  message: string;
  isSuccess: boolean;
  id: string;
}

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

  public notifyArray: InfoNotify[] = [];

  public registrationResponseData$ = this.authService.registrationResponseData$;

  public serverErrorMessage = '';
  public isUserExist = false;
  public canRequestBeSent = true;
  public currentEmail = '';
  public isShowUserError = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
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
          this.notifyArray.push({
            message: 'User successfully registered',
            isSuccess: true,
            id: window.crypto.randomUUID()
          });

          setTimeout(() => {
            this.router.navigate(['/signin']);
            this.canRequestBeSent = true;
          }, 2000);
        },
        error: (error) => {
          this.serverErrorMessage = error.error.message;
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
    if (message.endsWith('already exists')) {
      this.notifyArray.push({
        message: 'Unsuccessful! A user with this email already exists',
        isSuccess: false,
        id: window.crypto.randomUUID()
      });
    } else if (message.endsWith('are required')) {
      this.notifyArray.push({
        message: 'Unsuccessful! Please fill in all the fields',
        isSuccess: false,
        id: window.crypto.randomUUID()
      });
    } else {
      this.notifyArray.push({
        message: 'Something went wrong, please try again',
        isSuccess: false,
        id: window.crypto.randomUUID()
      });
    }
  }

  public goToTheLoginPage() {
    this.router.navigate(['/signin']);
  }

  public deleteNotify(id: string) {
    this.notifyArray = this.notifyArray.filter((notify) => notify.id !== id);
  }
}

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface ILoginResponseBody {
  token: string;
  uid: string;
}

interface InfoNotify {
  message: string;
  isSuccess: boolean;
  id: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl;
  }>;

  public loginResponseData$ = this.authService.loginResponseData$;
  public notifyArray: InfoNotify[] = [];

  public canRequestBeSent = true;

  private isUserNotExist = false;
  private currentUserData = {
    email: '',
    password: ''
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
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

      this.loginResponseData$.subscribe({
        next: (response) => {
          this.saveLoginTokensToLS(response.body as ILoginResponseBody);

          this.notifyArray.push({
            message: 'User has successfully logged in',
            isSuccess: true,
            id: window.crypto.randomUUID()
          });

          setTimeout(() => {
            this.router.navigate(['/']);
            this.canRequestBeSent = true;
          }, 2000);
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

  private saveLoginTokensToLS(body: ILoginResponseBody) {
    localStorage.setItem('token', body.token);
    localStorage.setItem('uid', body.uid);
    localStorage.setItem(
      'email',
      this.loginForm.controls.email.value as string
    );
  }

  private sendNotify(message: string) {
    if (message.endsWith('exist in the system.')) {
      this.notifyArray.push({
        message: 'This user does not exist. Please register first',
        isSuccess: false,
        id: window.crypto.randomUUID()
      });
    } else if (message.endsWith('are required.')) {
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

  public deleteNotify(id: string) {
    this.notifyArray = this.notifyArray.filter((notify) => notify.id !== id);
  }
}

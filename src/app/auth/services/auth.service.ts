import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';

interface RedistrationQueryParams {
  email: string;
  name: string;
  password: string;
}

interface LoginQueryParams {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isUserAuth: BehaviorSubject<boolean> = new BehaviorSubject(
    localStorage.getItem('token') ? true : false
  );

  public isUserAuth$: Observable<boolean> = this.isUserAuth.asObservable();

  public userLogin() {
    this.isUserAuth.next(true);
  }

  public userLogout() {
    this.isUserAuth.next(false);
  }

  private redistrationQueryParams: BehaviorSubject<RedistrationQueryParams> =
    new BehaviorSubject({
      email: '',
      name: '',
      password: ''
    });

  private loginQueryParams: BehaviorSubject<LoginQueryParams> =
    new BehaviorSubject({
      email: '',
      password: ''
    });

  constructor(private httpService: HttpService) {}

  public registrationResponseData$ = this.redistrationQueryParams.pipe(
    switchMap((query) => this.httpService.sendRegistrationRequest(query))
  );

  public loginResponseData$ = this.loginQueryParams.pipe(
    switchMap((query) => this.httpService.sendLoginRequest(query))
  );

  public changeRedistrationQueryParams(
    email: string,
    name: string,
    password: string
  ) {
    this.redistrationQueryParams.next({ email, name, password });
  }

  public changeLoginQueryParams(email: string, password: string) {
    this.loginQueryParams.next({ email, password });
  }
}

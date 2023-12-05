import { Injectable } from '@angular/core';
import { BehaviorSubject, switchMap } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';

interface IRedistrationQueryParams {
  email: string;
  name: string;
  password: string;
}

interface ILoginQueryParams {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private redistrationQueryParams: BehaviorSubject<IRedistrationQueryParams> =
    new BehaviorSubject({
      email: '',
      name: '',
      password: ''
    });

  private loginQueryParams: BehaviorSubject<ILoginQueryParams> =
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

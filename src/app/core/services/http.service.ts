import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface RegistrationParams {
  email: string;
  name: string;
  password: string;
}

interface LoginParams {
  email: string;
  password: string;
}

export interface UserParams {
  'rs-uid': string;
  'rs-email': string;
  Authorization: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly registerURL = 'registration';

  private readonly loginURL = 'login';

  private readonly profileURL = 'profile';

  constructor(private http: HttpClient) {}

  public sendRegistrationRequest(userData: RegistrationParams) {
    return this.http.post(this.registerURL, userData, { observe: 'response' });
  }

  public sendLoginRequest(userData: LoginParams) {
    return this.http.post(this.loginURL, userData, { observe: 'response' });
  }

  public sendProfileRequest(userData: UserParams) {
    return this.http.post(this.profileURL, userData, { observe: 'response' });
  }
}

import { CanActivateFn, Router } from '@angular/router';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(private router: Router) {}

  checkAuth() {
    if (
      localStorage.getItem('token') &&
      localStorage.getItem('uid') &&
      localStorage.getItem('email')
    ) {
      return true;
    } else {
      this.router.navigate(['/signin']);
      return false;
    }
  }
}

export const AuthGuard: CanActivateFn = () =>
  inject(AuthGuardService).checkAuth();

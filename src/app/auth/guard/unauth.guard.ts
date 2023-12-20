import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UnauthGuardService {
  constructor(private router: Router) {}

  checkAuth() {
    if (
      localStorage.getItem('token') &&
      localStorage.getItem('uid') &&
      localStorage.getItem('email')
    ) {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }
}

export const UnauthGuard: CanActivateFn = () =>
  inject(UnauthGuardService).checkAuth();

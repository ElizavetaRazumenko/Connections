import { Component, OnInit } from '@angular/core';
import { NavigationSkipped, NavigationStart, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { HttpService } from '../../services/http.service';
import { Store } from '@ngrx/store';
import { alertAddAlertAction } from 'src/app/redux/actions/alert.action';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public currentURl = '';

  public isUserAuth$ = this.authService.isUserAuth$;
  private ngSubscribe$ = new Subject<void>();

  public isLogoutButtonClicked = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private httpService: HttpService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationSkipped) {
        this.currentURl = event.url;
      } else if (event instanceof NavigationStart) {
        this.currentURl = event.url;
      }
    });
  }

  public goToTheMain() {
    this.router.navigate(['/']);
  }

  public goToTheProfile() {
    this.router.navigate(['/profile']);
  }

  public Logout() {
    if (!this.isLogoutButtonClicked) {
      this.isLogoutButtonClicked = true;
      this.httpService.logoutRequest().subscribe({
        next: () => {
          this.authService.userLogout();

          localStorage.removeItem('token');
          localStorage.removeItem('uid');
          localStorage.removeItem('email');

          this.store.dispatch(
            alertAddAlertAction({
              notify: {
                message: 'User has successfully logged out',
                isSuccess: true,
                id: window.crypto.randomUUID()
              }
            })
          );

          this.router.navigate(['/signin']);
          this.isLogoutButtonClicked = false;
        },
        error: () => {
          this.store.dispatch(
            alertAddAlertAction({
              notify: {
                message: 'Unsuccessful! Please try again',
                isSuccess: false,
                id: window.crypto.randomUUID()
              }
            })
          );

          this.isLogoutButtonClicked = false;
        }
      });
    }
  }
}

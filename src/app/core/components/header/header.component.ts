/* eslint-disable @ngrx/avoid-dispatching-multiple-actions-sequentially */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationSkipped, NavigationStart, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { HttpService } from '../../services/http.service';
import { Store } from '@ngrx/store';
import { alertAddAlertAction } from 'src/app/redux/actions/alert.action';
import { Subject, take, takeUntil } from 'rxjs';
import { CurrentTheme, ThemeService } from '../../services/theme.service';
import { chatsClearAction } from 'src/app/redux/actions/group-chats.action';
import { groupClearAction } from 'src/app/redux/actions/group.action';
import { profileClearAction } from 'src/app/redux/actions/profile.action';
import { chatsUsersClearAction } from 'src/app/redux/actions/user-chats.action';
import { usersClearAction } from 'src/app/redux/actions/users.action';
import { ApplicationService } from 'src/app/application/services/application.service';
import { GroupService } from 'src/app/application/services/group.service';

enum Themes {
  DARK = 'dark',
  LIGHT = 'light',
  DEFAULT = 'default'
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public currentURl = '';

  public isDarkTheme = localStorage.getItem('theme') === 'dark';

  public isUserAuth$ = this.authService.isUserAuth$;
  private ngSubscribe$ = new Subject<void>();

  public isLogoutButtonClicked = false;

  private currentTheme$ = this.themeService.currentTheme$;
  public currentTheme: CurrentTheme = Themes.LIGHT;

  constructor(
    private router: Router,
    private authService: AuthService,
    private httpService: HttpService,
    private store: Store,
    private themeService: ThemeService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(takeUntil(this.ngSubscribe$)).subscribe((event) => {
      if (event instanceof NavigationSkipped) {
        this.currentURl = event.url;
      } else if (event instanceof NavigationStart) {
        this.currentURl = event.url;
      }
    });

    this.currentTheme$.pipe(takeUntil(this.ngSubscribe$)).subscribe((theme) => {
      this.currentTheme = theme;
    });
  }

  ngOnDestroy(): void {
    this.ngSubscribe$.next();
    this.ngSubscribe$.complete();
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
      this.httpService
        .logoutRequest()
        .pipe(take(1))
        .subscribe({
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
            // REMOVE DATA FROM STORE
            this.store.dispatch(chatsClearAction());
            this.store.dispatch(groupClearAction());
            this.store.dispatch(profileClearAction());
            this.store.dispatch(chatsUsersClearAction());
            this.store.dispatch(usersClearAction());

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

  public switchTheme() {
    if (this.currentTheme === 'dark') {
      this.themeService.changeTheme(Themes.LIGHT);
      this.isDarkTheme = false;
    } else {
      this.themeService.changeTheme(Themes.DARK);
      this.isDarkTheme = true;
    }
  }
}

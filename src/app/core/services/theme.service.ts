import { Inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Subscription,
  filter,
  fromEvent,
  map,
  tap
} from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { DOCUMENT } from '@angular/common';

enum Themes {
  DARK = 'dark',
  LIGHT = 'light',
  DEFAULT = 'default'
}
type Theme = Themes.DARK | Themes.LIGHT | Themes.DEFAULT;
export type CurrentTheme = Themes.DARK | Themes.LIGHT;

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly localStorageKey: string = 'theme';
  private readonly stateTheme = new BehaviorSubject<Theme>(Themes.DEFAULT);
  private readonly stateCurrentTheme = new BehaviorSubject<CurrentTheme | null>(
    null
  );
  private readonly matchMediaDark$ = fromEvent<MediaQueryListEvent>(
    window.matchMedia('(prefers-color-scheme: dark)'),
    'change'
  ).pipe(tap((listEvent) => this.matchMediaDarkListener(listEvent)));
  private readonly subs: Subscription | null = null;
  private htmlNode = this.document.documentElement;

  constructor(
    private readonly localStorageService: LocalStorageService,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    this.initThemeFromLS();
    this.subs = this.matchMediaDark$.subscribe();
  }

  public currentTheme$ = this.stateCurrentTheme.asObservable().pipe(
    filter((currentTheme) => {
      return currentTheme !== null;
    }),
    map((item) => item as CurrentTheme)
  );

  private matchMediaDarkListener(listEvent: MediaQueryListEvent) {
    const isDark = listEvent.matches;
    const currentTheme = isDark ? Themes.DARK : Themes.LIGHT;

    this.localStorageService.set(this.localStorageKey, currentTheme);
    this.stateCurrentTheme.next(currentTheme);
  }

  private initThemeFromLS() {
    const themeValue = this.localStorageService.get(this.localStorageKey);

    if (themeValue === Themes.DARK) {
      this.stateTheme.next(Themes.DARK);
      this.stateCurrentTheme.next(Themes.DARK);
      this.htmlNode.classList.add('dark-theme');
    } else {
      this.stateTheme.next(Themes.LIGHT);
      this.stateCurrentTheme.next(Themes.LIGHT);
      this.htmlNode.classList.add('light-theme');
    }
  }

  public changeTheme(theme: CurrentTheme) {
    this.stateTheme.next(theme);
    this.stateCurrentTheme.next(theme);
    this.localStorageService.set(this.localStorageKey, theme);

    const newThemeClass = theme === 'dark' ? 'dark-theme' : 'light-theme';
    const oldThemeClass = theme === 'dark' ? 'light-theme' : 'dark-theme';

    this.htmlNode.classList.remove(oldThemeClass);
    this.htmlNode.classList.add(newThemeClass);
  }
}

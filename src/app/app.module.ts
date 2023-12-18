import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { reducers } from './redux/reducers';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { ApplicationModule } from './application/application.module';
import { StoreModule } from '@ngrx/store';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreInterceptor } from './core/interceptor/http.interceptor';
import { EffectsModule } from '@ngrx/effects';
import { ProfileEffects } from './redux/effects/profile.effect';
import { GroupEffects } from './redux/effects/group.effect';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { UsersEffects } from './redux/effects/users.effect';
import { GroupChatsEffects } from './redux/effects/group-chats.effect';
import { UserChatsEffects } from './redux/effects/user-chats.effect';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    CoreModule,
    ApplicationModule,
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true
      }
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    EffectsModule.forRoot([
      ProfileEffects,
      GroupEffects,
      UsersEffects,
      GroupChatsEffects,
      UserChatsEffects
    ])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CoreInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

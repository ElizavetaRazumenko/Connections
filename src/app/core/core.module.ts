import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LogoComponent } from './components/logo/logo.component';
import { HttpClientModule } from '@angular/common/http';
import { AlertComponent } from './components/alert/alert.component';
import { AlertWrapperComponent } from './components/alert-wrapper/alert-wrapper.component';
import { TimerCounterComponent } from './components/timer-counter/timer-counter.component';
import { ModalComponent } from './components/modal/modal.component';
import { TimerUsersCounterComponent } from './components/timer-users-counter/timer-users-counter.component';
import { TimerGroupChatsComponent } from './components/timer-group-chats/timer-group-chats.component';

@NgModule({
  declarations: [
    HeaderComponent,
    LogoComponent,
    AlertComponent,
    AlertWrapperComponent,
    TimerCounterComponent,
    ModalComponent,
    TimerUsersCounterComponent,
    TimerGroupChatsComponent
  ],
  imports: [CommonModule, HttpClientModule],
  exports: [
    HeaderComponent,
    AlertWrapperComponent,
    TimerCounterComponent,
    TimerUsersCounterComponent,
    TimerGroupChatsComponent,
    ModalComponent
  ]
})
export class CoreModule {}

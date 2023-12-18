import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './pages/error/error.component';
import { MainComponent } from './pages/main/main.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupComponent } from './components/group/group.component';
import { GroupsListComponent } from './components/groups-list/groups-list.component';
import { LeadingZeroPipe } from './pipes/leading-zero.pipe';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UserComponent } from './components/user/user.component';
import { GroupDialogComponent } from './pages/group-dialog/group-dialog.component';
import { RouterModule } from '@angular/router';
import { GroupMessageComponent } from './components/group-message/group-message.component';
import { DateMessagesPipe } from './pipes/date-messages.pipe';
import { DateSortingPipe } from './pipes/date-sorting.pipe';
import { UsersDialogsComponent } from './pages/users-dialogs/users-dialogs.component';

@NgModule({
  declarations: [
    ErrorComponent,
    MainComponent,
    ProfileComponent,
    GroupComponent,
    GroupsListComponent,
    LeadingZeroPipe,
    UsersListComponent,
    UserComponent,
    GroupDialogComponent,
    GroupMessageComponent,
    DateMessagesPipe,
    DateSortingPipe,
    UsersDialogsComponent
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [
    ErrorComponent,
    MainComponent,
    ProfileComponent,
    GroupDialogComponent,
    UsersDialogsComponent
  ]
})
export class ApplicationModule {}

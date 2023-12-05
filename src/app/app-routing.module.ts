import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './auth/pages/registration/registration.component';
import { ErrorComponent } from './application/pages/error/error.component';
import { LoginComponent } from './auth/pages/login/login.component';
import { MainComponent } from './application/pages/main/main.component';
import { AuthGuard } from './auth/guard/auth.guard';
import { ProfileComponent } from './application/pages/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MainComponent,
    canActivate: [AuthGuard]
  },
  { path: 'signup', component: RegistrationComponent },
  { path: 'signin', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
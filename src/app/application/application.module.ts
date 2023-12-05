import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './pages/error/error.component';
import { MainComponent } from './pages/main/main.component';
import { ProfileComponent } from './pages/profile/profile.component';

@NgModule({
  declarations: [ErrorComponent, MainComponent, ProfileComponent],
  imports: [CommonModule],
  exports: [ErrorComponent, MainComponent, ProfileComponent]
})
export class ApplicationModule {}

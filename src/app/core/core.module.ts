import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LogoComponent } from './components/logo/logo.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [HeaderComponent, LogoComponent],
  imports: [CommonModule, HttpClientModule],
  exports: [HeaderComponent]
})
export class CoreModule {}

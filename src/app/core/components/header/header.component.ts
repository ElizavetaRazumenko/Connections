import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public currentURl = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
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
}

import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAlertNotifies } from 'src/app/redux/selectors/alert.selector';

@Component({
  selector: 'app-alert-wrapper',
  templateUrl: './alert-wrapper.component.html',
  styleUrls: ['./alert-wrapper.component.scss']
})
export class AlertWrapperComponent {
  public alerts$ = this.store.select(selectAlertNotifies);

  constructor(private readonly store: Store) {}
}

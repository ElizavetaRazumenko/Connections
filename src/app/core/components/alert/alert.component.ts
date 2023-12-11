import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { alertDeleteNotifyAction } from 'src/app/redux/actions/alert.action';

interface InfoNotify {
  message: string;
  isSuccess: boolean;
  id: string;
}

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() public notifyInfo!: InfoNotify;

  constructor(private store: Store) {}

  ngOnInit(): void {
    setTimeout(() => this.deleteNotify(), 4000);
  }

  public deleteNotify() {
    this.store.dispatch(alertDeleteNotifyAction({ id: this.notifyInfo.id }));
  }
}

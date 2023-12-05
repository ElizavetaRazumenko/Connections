import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  @Output() public eventDeleteNotify = new EventEmitter();

  ngOnInit(): void {
    setTimeout(() => this.deleteNotify(), 4000);
  }

  public deleteNotify() {
    this.eventDeleteNotify.emit(this.notifyInfo.id);
  }
}

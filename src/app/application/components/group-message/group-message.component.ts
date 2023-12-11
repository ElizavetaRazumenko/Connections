import { Component, Input } from '@angular/core';
import { MessagesInfo } from 'src/app/redux/models/group-chats.model';

@Component({
  selector: 'app-group-message',
  templateUrl: './group-message.component.html',
  styleUrls: ['./group-message.component.scss']
})
export class GroupMessageComponent {
  @Input() messageInfo!: MessagesInfo;
}

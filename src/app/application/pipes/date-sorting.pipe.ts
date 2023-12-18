import { Pipe, PipeTransform } from '@angular/core';
import { MessagesInfo } from 'src/app/redux/models/group-chats.model';

@Pipe({
  name: 'dateSorting'
})
export class DateSortingPipe implements PipeTransform {
  transform(messages: MessagesInfo[]): MessagesInfo[] {
    const cloneMessages = Array.from(messages);
    return cloneMessages.sort(
      (messageA, messageB) =>
        Number(messageA.createdAt) - Number(messageB.createdAt)
    );
  }
}

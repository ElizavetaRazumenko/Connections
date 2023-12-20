import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, of, switchMap, take } from 'rxjs';
import * as GroupChatsActions from '../actions/group-chats.action';
import * as TimerActions from '../actions/timerGroupChats.action';
import * as AlertActions from '../actions/alert.action';
import {
  HttpService,
  ResponseGroupMessagesData
} from 'src/app/core/services/http.service';
import { GroupChat } from '../models/group-chats.model';

@Injectable()
export class GroupChatsEffects {
  constructor(
    private actions$: Actions,
    private httpService: HttpService
  ) {}

  getGroupChats$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupChatsActions.chatsSendDataAction),
      switchMap((requestData) =>
        this.httpService
          .getGroupMessages(requestData.id, requestData.since)
          .pipe(
            mergeMap((data) => [
              GroupChatsActions.chatsSaveDataAction({
                chatData: this.convertData(
                  requestData.id,
                  data.body as ResponseGroupMessagesData
                )
              }),
              TimerActions.timerChangeFlagAction({ timerFlag: true }),
              AlertActions.alertAddAlertAction({
                notify: {
                  message: 'Groups chat updated successfully',
                  isSuccess: true,
                  id: window.crypto.randomUUID()
                }
              })
            ]),
            catchError((error) => {
              const message = error.error.message as string;
              return of(GroupChatsActions.chatsErrorAction({ message }));
            })
          )
      )
    );
  });

  getGroupChatsNoTimer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupChatsActions.chatsSendDataNoTimerAction),
      switchMap((requestData) =>
        this.httpService
          .getGroupMessages(requestData.id, requestData.since)
          .pipe(
            take(1),
            mergeMap((data) => [
              GroupChatsActions.chatsSaveDataAction({
                chatData: this.convertData(
                  requestData.id,
                  data.body as ResponseGroupMessagesData
                )
              })
            ]),
            catchError((error) => {
              const message = error.error.message as string;
              return of(GroupChatsActions.chatsErrorAction({ message }));
            })
          )
      )
    );
  });

  private convertData(id: string, data: ResponseGroupMessagesData): GroupChat {
    return {
      id,
      lastRequestAt: `${new Date().getTime()}`,
      messages: [
        ...data.Items.map((message) => ({
          authorID: message.authorID.S,
          message: message.message.S,
          createdAt: message.createdAt.S,
          isMyMessage: localStorage.getItem('uid') === message.authorID.S
        }))
      ]
    };
  }
}
